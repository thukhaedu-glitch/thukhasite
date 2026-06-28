import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  User,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CloudUpload,
  Heading,
  ImagePlus,
  List,
  ListOrdered,
  LogOut,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { auth, db, isFirebaseConfigured, storage } from '../firebase';
import { bundledContent, defaultSiteSettings } from '../content';

type EditableDocument = Record<string, unknown> & { id: string };

const collections = [
  { id: 'projects', label: 'Case Studies' },
  { id: 'blogPosts', label: 'Blog' },
  { id: 'websites', label: 'Web Experiences' },
  { id: 'creativeItems', label: 'Creative / Media' },
  { id: 'volunteering', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'ventures', label: 'Ventures' },
  { id: 'siteSettings', label: 'Global SEO & Site' },
] as const;

type CollectionId = (typeof collections)[number]['id'];

const defaultDocuments: Record<CollectionId, EditableDocument[]> = {
  projects: bundledContent.projects as unknown as EditableDocument[],
  blogPosts: bundledContent.blogPosts as unknown as EditableDocument[],
  websites: bundledContent.websites as unknown as EditableDocument[],
  creativeItems: bundledContent.creativeItems as unknown as EditableDocument[],
  volunteering: bundledContent.volunteering as unknown as EditableDocument[],
  certifications: bundledContent.certifications as unknown as EditableDocument[],
  ventures: bundledContent.ventures as unknown as EditableDocument[],
  siteSettings: [defaultSiteSettings as unknown as EditableDocument],
};

const documentTemplates: Record<CollectionId, EditableDocument> = {
  projects: {
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    market: '',
    industry: '',
    stats: '',
    services: [],
    results: [],
    fullDetails: '',
    coverImage: '',
    videoUrl: '',
    published: true,
    order: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    ogImage: '',
    canonicalUrl: '',
  },
  blogPosts: {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    readTime: '',
    date: '',
    category: '',
    content: '',
    contentBlocks: [],
    authorName: 'Thukha Aung',
    authorPhoto: '',
    relatedService: '',
    coverImage: '',
    videoUrl: '',
    published: true,
    order: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    ogImage: '',
    canonicalUrl: '',
  },
  websites: {
    id: '',
    title: '',
    tagline: '',
    description: '',
    tech: [],
    mockType: 'pricing-calculator',
    caseStudy: '',
    imageUrl: '',
    liveUrl: '',
    published: true,
    order: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    ogImage: '',
    canonicalUrl: '',
  },
  creativeItems: {
    id: '',
    category: 'graphics',
    title: '',
    subtitle: '',
    imageUrl: '',
    galleryImages: [],
    videoUrl: '',
    embedType: 'image',
    techUsed: [],
    published: true,
    order: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    ogImage: '',
    canonicalUrl: '',
  },
  volunteering: {
    id: '',
    organization: '',
    role: '',
    period: '',
    location: '',
    points: [],
    impactStat: '',
    published: true,
    order: 0,
  },
  certifications: {
    id: '',
    title: '',
    issuer: '',
    year: '',
    accent: '',
    published: true,
    order: 0,
  },
  ventures: {
    id: '',
    title: '',
    type: '',
    tag: 'Ecommerce',
    metrics: '',
    description: '',
    investmentRequired: '',
    longDescription: '',
    published: true,
    order: 0,
  },
  siteSettings: defaultSiteSettings as unknown as EditableDocument,
};

const blankFrom = (collectionId: CollectionId): EditableDocument => {
  const sample = documentTemplates[collectionId];
  return Object.fromEntries(
    Object.entries(sample)
      .filter(([key]) => !['createdAt', 'updatedAt'].includes(key))
      .map(([key, value]) => {
        if (key === 'id') {
          return [key, collectionId === 'siteSettings' ? 'main' : `${collectionId}-${Date.now()}`];
        }
        if (Array.isArray(value)) return [key, []];
        if (typeof value === 'boolean') return [key, true];
        if (typeof value === 'number') return [key, 0];
        return [key, ''];
      }),
  ) as EditableDocument;
};

const humanize = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase());

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeCollection, setActiveCollection] = useState<CollectionId>('projects');
  const [documents, setDocuments] = useState<EditableDocument[]>([]);
  const [selected, setSelected] = useState<EditableDocument | null>(null);
  const [notice, setNotice] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }
    setPersistence(auth, browserLocalPersistence);
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    return onSnapshot(
      collection(db, activeCollection),
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as EditableDocument[];
        items.sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999));
        setDocuments(items);
        setSelected((current) => {
          if (!current) return items[0] || null;
          return items.find((item) => item.id === current.id) || items[0] || null;
        });
      },
      (error) => setNotice(`Permission error: ${error.message}`),
    );
  }, [activeCollection, user]);

  const titleKey = useMemo(() => {
    if (activeCollection === 'siteSettings') return 'siteName';
    if (activeCollection === 'volunteering') return 'organization';
    return 'title';
  }, [activeCollection]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth) return;
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const save = async () => {
    if (!db || !selected) return;
    if (!selected.id.trim()) {
      setNotice('Document ID is required.');
      return;
    }
    const { id, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = selected;
    if (
      (activeCollection === 'projects' || activeCollection === 'blogPosts') &&
      !String(payload.slug || '').trim()
    ) {
      payload.slug = slugify(String(payload.title || id));
    }
    await setDoc(
      doc(db, activeCollection, id),
      {
        ...payload,
        published: payload.published ?? true,
        order: Number(payload.order ?? documents.length),
        updatedAt: serverTimestamp(),
        createdAt: selected.createdAt || serverTimestamp(),
      },
      { merge: true },
    );
    if (payload.slug) {
      setSelected((current) => (current ? { ...current, slug: payload.slug } : current));
    }
    setNotice('Saved successfully.');
  };

  const remove = async () => {
    if (!db || !selected || !window.confirm(`Delete "${selected[titleKey] || selected.id}"?`)) return;
    await deleteDoc(doc(db, activeCollection, selected.id));
    setSelected(null);
    setNotice('Deleted.');
  };

  const seedDefaults = async () => {
    if (!db || !window.confirm('Import bundled portfolio content into empty Firestore collections?')) return;
    let imported = 0;
    for (const item of collections) {
      const existing = await getDocs(collection(db, item.id));
      if (!existing.empty) continue;
      const batch = writeBatch(db);
      defaultDocuments[item.id].forEach((entry, index) => {
        const { id, ...data } = entry;
        batch.set(doc(db!, item.id, id), {
          ...data,
          published: data.published ?? true,
          order: data.order ?? index,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      imported += defaultDocuments[item.id].length;
    }
    setNotice(`Imported ${imported} starter documents.`);
  };

  const updateField = (key: string, value: unknown) => {
    setSelected((current) => (current ? { ...current, [key]: value } : current));
  };

  const uploadMedia = (file: File, field: string, onUploaded?: (url: string) => void) => {
    if (!storage || !selected) return;
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectRef = ref(storage, `portfolio/${activeCollection}/${selected.id}/${Date.now()}-${cleanName}`);
    const task = uploadBytesResumable(objectRef, file, { contentType: file.type });
    setUploadProgress(0);
    task.on(
      'state_changed',
      (snapshot) => setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (error) => {
        setNotice(error.message);
        setUploadProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        if (onUploaded) {
          onUploaded(url);
        } else if (field === 'galleryImages') {
          setSelected((current) => {
            if (!current) return current;
            const existing = Array.isArray(current.galleryImages)
              ? (current.galleryImages as string[])
              : [];
            return { ...current, galleryImages: [...existing, url] };
          });
        } else {
          updateField(field, url);
        }
        setUploadProgress(null);
        setNotice(`Uploaded. Save the document to keep the ${field} URL.`);
      },
    );
  };

  if (!isFirebaseConfigured) {
    return (
      <AdminMessage
        title="Firebase setup required"
        body="Copy .env.example to .env.local and add your Firebase web app configuration before opening the admin panel."
      />
    );
  }

  if (!authReady) return <AdminMessage title="Loading admin…" body="Checking your Firebase session." />;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-200 flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-md bg-[#0e1422] border border-slate-800 rounded-2xl p-8 space-y-5">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <ArrowLeft size={14} /> Back to portfolio
          </a>
          <div>
            <p className="text-emerald-400 text-xs font-mono uppercase">Secure CMS</p>
            <h1 className="text-2xl font-bold text-white mt-1">Portfolio Admin</h1>
          </div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            required
          />
          {authError && <p className="text-red-400 text-xs">{authError}</p>}
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 font-bold">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      <header className="sticky top-0 z-20 bg-[#0b111e]/95 backdrop-blur border-b border-slate-800 px-5 py-4 flex gap-4 items-center justify-between">
        <div>
          <p className="text-[10px] text-emerald-400 font-mono uppercase">Firebase CMS</p>
          <h1 className="text-lg font-bold text-white">Portfolio Admin</h1>
        </div>
        <div className="flex gap-2">
          <a href="/" className="px-3 py-2 rounded-lg border border-slate-700 text-xs hover:text-white">View site</a>
          <button onClick={() => auth && signOut(auth)} className="px-3 py-2 rounded-lg border border-slate-700 text-xs flex gap-2 items-center">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[220px_300px_1fr] min-h-[calc(100vh-73px)]">
        <aside className="border-r border-slate-800 p-4 space-y-2">
          {collections.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCollection(item.id);
                setSelected(null);
                setNotice('');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs ${
                activeCollection === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button onClick={seedDefaults} className="w-full mt-5 px-3 py-2.5 rounded-lg text-xs border border-emerald-800 text-emerald-400">
            Import starter content
          </button>
        </aside>

        <aside className="border-r border-slate-800 p-4">
          <button
            onClick={() => setSelected(blankFrom(activeCollection))}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 mb-4"
          >
            <Plus size={14} /> New document
          </button>
          <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
            {documents.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left p-3 rounded-lg border text-xs ${
                  selected?.id === item.id
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400'
                }`}
              >
                <span className="block truncate font-semibold">{String(item[titleKey] || item.id)}</span>
                <span className="block text-[10px] text-slate-600 mt-1 truncate">{item.id}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="p-5 sm:p-8 max-w-4xl">
          {!selected ? (
            <div className="text-slate-500 text-sm">Choose a document or create a new one.</div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-400 font-mono uppercase">{activeCollection}</p>
                  <h2 className="text-xl font-bold text-white">{String(selected[titleKey] || 'New document')}</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={remove} className="px-3 py-2 rounded-lg border border-red-900 text-red-400 text-xs flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                  <button onClick={save} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-2">
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>

              {notice && <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">{notice}</div>}

              {activeCollection === 'blogPosts' ? (
                <BlogEditor
                  document={selected}
                  updateField={updateField}
                  uploadMedia={uploadMedia}
                  uploadProgress={uploadProgress}
                />
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(selected)
                      .filter(([key]) => !['createdAt', 'updatedAt'].includes(key))
                      .map(([key, value]) => (
                        <FieldEditor key={key} fieldKey={key} value={value} onChange={(next) => updateField(key, next)} />
                      ))}
                  </div>

                  <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5">
                <div className="flex gap-2 items-center mb-3">
                  <CloudUpload size={16} className="text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Image / video upload</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For a graphic gallery, choose galleryImages and select multiple images. Save after uploads finish.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select id="media-field" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs">
                    {['coverImage', 'imageUrl', 'galleryImages', 'videoUrl', 'ogImage', 'defaultOgImage'].map((field) => (
                      <option key={field}>{field}</option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="text-xs text-slate-400"
                    onChange={(event) => {
                      const files = Array.from(event.target.files || []);
                      const field = (document.getElementById('media-field') as HTMLSelectElement)?.value || 'imageUrl';
                      if (field === 'galleryImages') {
                        files.filter((file) => file.type.startsWith('image/')).forEach((file) => uploadMedia(file, field));
                      } else if (files[0]) {
                        uploadMedia(files[0], field);
                      }
                    }}
                  />
                </div>
                {uploadProgress !== null && <p className="text-xs text-emerald-400 mt-3">Uploading {uploadProgress}%</p>}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

type UploadMedia = (
  file: File,
  field: string,
  onUploaded?: (url: string) => void,
) => void;

type EditorBlock = {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet-list' | 'numbered-list' | 'image';
  content: string;
  alt?: string;
};

function BlogEditor({
  document,
  updateField,
  uploadMedia,
  uploadProgress,
}: {
  document: EditableDocument;
  updateField: (key: string, value: unknown) => void;
  uploadMedia: UploadMedia;
  uploadProgress: number | null;
}) {
  const blocks = Array.isArray(document.contentBlocks)
    ? (document.contentBlocks as EditorBlock[])
    : [];

  const setBlocks = (next: EditorBlock[]) => updateField('contentBlocks', next);

  const addBlock = (type: EditorBlock['type']) => {
    setBlocks([
      ...blocks,
      {
        id: `${type}-${Date.now()}`,
        type,
        content: '',
        ...(type === 'image' ? { alt: '' } : {}),
      },
    ]);
  };

  const updateBlock = (id: string, patch: Partial<EditorBlock>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter((block) => block.id !== id));

  return (
    <div className="space-y-7 rounded-2xl border border-slate-800 bg-[#0b111d] p-5 sm:p-7">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <BookOpen size={20} className="text-indigo-400" />
        <div>
          <h3 className="font-bold text-white">Blog Publication Editor</h3>
          <p className="text-xs text-slate-500">Write, optimize, and publish a complete article.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <BlogInput label="Article title" value={document.title} onChange={(value) => updateField('title', value)} />
        <BlogInput label="Friendly URL slug" value={document.slug} placeholder="e.g. secure-firebase-setup" onChange={(value) => updateField('slug', slugify(value))} />
        <BlogInput label="Category tag" value={document.category} placeholder="SEO & Growth" onChange={(value) => updateField('category', value)} />
        <label className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Status mode</span>
          <select
            value={document.published === false ? 'draft' : 'published'}
            onChange={(event) => updateField('published', event.target.value === 'published')}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs outline-none focus:border-indigo-500"
          >
            <option value="published">Published (Public can read)</option>
            <option value="draft">Draft (Admin only)</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ImageUploadCard
          label="Cover image"
          value={String(document.coverImage || '')}
          field="coverImage"
          uploadMedia={uploadMedia}
          onClear={() => updateField('coverImage', '')}
        />
        <ImageUploadCard
          label="Social share image (1200×630 recommended)"
          value={String(document.ogImage || '')}
          field="ogImage"
          uploadMedia={uploadMedia}
          onClear={() => updateField('ogImage', '')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <BlogInput label="Author name" value={document.authorName} onChange={(value) => updateField('authorName', value)} />
        <ImageUploadCard
          label="Author photo"
          value={String(document.authorPhoto || '')}
          field="authorPhoto"
          compact
          uploadMedia={uploadMedia}
          onClear={() => updateField('authorPhoto', '')}
        />
      </div>

      <label className="block space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Short excerpt summary (1–2 sentences)</span>
        <textarea
          value={String(document.excerpt || '')}
          onChange={(event) => updateField('excerpt', event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs outline-none focus:border-indigo-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <BlogInput label="Read time" value={document.readTime} placeholder="6 min read" onChange={(value) => updateField('readTime', value)} />
        <BlogInput label="Date" value={document.date} placeholder="June 21, 2026" onChange={(value) => updateField('date', value)} />
        <BlogInput label="Related service" value={document.relatedService} placeholder="No related service" onChange={(value) => updateField('relatedService', value)} />
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500">Article content</p>
            <p className="mt-1 text-xs text-slate-600">Build the article with reorderable content blocks.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addBlock('heading')} className="editor-action"><Heading size={14} /> Heading</button>
            <button type="button" onClick={() => addBlock('paragraph')} className="editor-action"><AlignLeft size={14} /> Text</button>
            <button type="button" onClick={() => addBlock('bullet-list')} className="editor-action"><List size={14} /> Bullets</button>
            <button type="button" onClick={() => addBlock('numbered-list')} className="editor-action"><ListOrdered size={14} /> Numbered</button>
            <button type="button" onClick={() => addBlock('image')} className="editor-action editor-action-primary"><ImagePlus size={14} /> Image</button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {blocks.length === 0 && (
            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="w-full rounded-xl border border-dashed border-slate-700 px-5 py-10 text-xs text-slate-500 hover:border-indigo-500 hover:text-indigo-300"
            >
              Add your first content block
            </button>
          )}

          {blocks.map((block, index) => (
            <div key={block.id} className="rounded-xl border border-slate-800 bg-[#080c14] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500">{block.type}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="block-icon"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="block-icon"><ArrowDown size={14} /></button>
                  <button type="button" onClick={() => removeBlock(block.id)} className="block-icon text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>

              {block.type === 'heading' && (
                <input
                  value={block.content}
                  onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                  placeholder="Section heading"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500"
                />
              )}
              {block.type === 'paragraph' && (
                <textarea
                  value={block.content}
                  onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                  placeholder="Write paragraph text..."
                  rows={7}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 outline-none focus:border-indigo-500"
                />
              )}
              {(block.type === 'bullet-list' || block.type === 'numbered-list') && (
                <textarea
                  value={block.content}
                  onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                  placeholder={'Write one list item per line...\nSecond item\nThird item'}
                  rows={6}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 outline-none focus:border-indigo-500"
                />
              )}
              {block.type === 'image' && (
                <div className="space-y-3">
                  {block.content && <img src={block.content} alt={block.alt || 'Article content'} className="max-h-64 w-full rounded-lg object-cover" />}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs text-slate-400"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadMedia(file, 'contentBlocks', (url) => updateBlock(block.id, { content: url }));
                      }}
                    />
                    <input
                      value={block.alt || ''}
                      onChange={(event) => updateBlock(block.id, { alt: event.target.value })}
                      placeholder="Image alt text for SEO"
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-white">Search & social metadata</h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <BlogInput label="Custom SEO title" value={document.seoTitle} onChange={(value) => updateField('seoTitle', value)} />
          <BlogInput label="Canonical URL" value={document.canonicalUrl} placeholder="Auto-generated if empty" onChange={(value) => updateField('canonicalUrl', value)} />
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Custom SEO description</span>
            <textarea value={String(document.seoDescription || '')} onChange={(event) => updateField('seoDescription', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs outline-none focus:border-indigo-500" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">SEO keywords — one per line</span>
            <textarea
              value={Array.isArray(document.seoKeywords) ? (document.seoKeywords as string[]).join('\n') : ''}
              onChange={(event) => updateField('seoKeywords', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
              rows={4}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs outline-none focus:border-indigo-500"
            />
          </label>
        </div>
      </section>

      {uploadProgress !== null && (
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-300">
          Uploading {uploadProgress}%
        </div>
      )}
    </div>
  );
}

function BlogInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: unknown;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">{label}</span>
      <input
        value={String(value || '')}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs outline-none focus:border-indigo-500"
      />
    </label>
  );
}

function ImageUploadCard({
  label,
  value,
  field,
  compact = false,
  uploadMedia,
  onClear,
}: {
  label: string;
  value: string;
  field: string;
  compact?: boolean;
  uploadMedia: UploadMedia;
  onClear: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">{label}</span>
      <div className={`relative flex items-center gap-3 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 p-3 ${compact ? 'min-h-20' : 'min-h-28'}`}>
        {value && <img src={value} alt="" className={`${compact ? 'h-14 w-14' : 'h-20 w-24'} rounded-lg border border-slate-700 object-cover`} />}
        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/10">
          <CloudUpload size={17} />
          {value ? 'Change image' : 'Choose image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadMedia(file, field);
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={onClear} className="absolute right-2 top-2 rounded-full bg-slate-950 p-1 text-slate-500 hover:text-red-400">
            <X size={13} />
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-600">JPG, PNG or WebP. Keep images optimized.</p>
    </div>
  );
}

function FieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const isLongText = ['content', 'fullDetails', 'caseStudy', 'description', 'longDescription', 'excerpt'].includes(fieldKey);
  const fullWidth = isLongText || Array.isArray(value) || fieldKey.toLowerCase().includes('description');

  return (
    <label className={`space-y-1.5 ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase font-mono text-slate-500">{humanize(fieldKey)}</span>
      {typeof value === 'boolean' ? (
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="block h-5 w-5" />
      ) : Array.isArray(value) ? (
        <textarea
          value={value.join('\n')}
          onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
          rows={Math.max(3, value.length + 1)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
          placeholder="One item per line"
        />
      ) : isLongText ? (
        <textarea
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
          rows={fieldKey === 'content' ? 14 : 6}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
        />
      ) : (
        <input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={String(value ?? '')}
          disabled={fieldKey === 'id'}
          onChange={(event) => onChange(typeof value === 'number' ? Number(event.target.value) : event.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:opacity-60"
        />
      )}
    </label>
  );
}

function AdminMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex items-center justify-center p-6">
      <div className="max-w-lg bg-[#0e1422] border border-slate-800 rounded-2xl p-8">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="text-sm text-slate-400 mt-2">{body}</p>
        <a href="/" className="inline-flex items-center gap-2 mt-5 text-xs text-emerald-400">
          <ArrowLeft size={14} /> Back to portfolio
        </a>
      </div>
    </div>
  );
}
