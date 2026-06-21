import { FormEvent, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  ArrowLeft,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import {
  auth,
  db,
  isFirebaseConfigured,
  storage,
} from "../firebase";

type DocumentData = Record<string, unknown> & {
  id: string;
};

const cmsCollections = [
  { id: "projects", label: "Case Studies" },
  { id: "blogPosts", label: "Blog Posts" },
  { id: "websites", label: "Web Experiences" },
  { id: "creativeItems", label: "Images & Videos" },
  { id: "volunteering", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "ventures", label: "Ventures" },
  { id: "siteSettings", label: "SEO & Site Settings" },
] as const;

type CollectionName =
  (typeof cmsCollections)[number]["id"];

function createBlank(
  collectionName: CollectionName,
): DocumentData {
  const id =
    collectionName === "siteSettings"
      ? "main"
      : `${collectionName}-${Date.now()}`;

  const common = {
    id,
    published: true,
    order: 0,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    ogImage: "",
    canonicalUrl: "",
  };

  if (collectionName === "projects") {
    return {
      ...common,
      title: "",
      subtitle: "",
      market: "",
      industry: "",
      stats: "",
      services: [],
      results: [],
      fullDetails: "",
      coverImage: "",
      videoUrl: "",
    };
  }

  if (collectionName === "blogPosts") {
    return {
      ...common,
      title: "",
      slug: "",
      excerpt: "",
      readTime: "",
      date: "",
      category: "",
      content: "",
      coverImage: "",
      videoUrl: "",
    };
  }

  if (collectionName === "websites") {
    return {
      ...common,
      title: "",
      tagline: "",
      description: "",
      tech: [],
      mockType: "pricing-calculator",
      caseStudy: "",
      imageUrl: "",
      liveUrl: "",
    };
  }

  if (collectionName === "creativeItems") {
    return {
      ...common,
      category: "graphics",
      title: "",
      subtitle: "",
      imageUrl: "",
      videoUrl: "",
      embedType: "image",
      techUsed: [],
    };
  }

  if (collectionName === "volunteering") {
    return {
      ...common,
      organization: "",
      role: "",
      period: "",
      location: "",
      points: [],
      impactStat: "",
    };
  }

  if (collectionName === "certifications") {
    return {
      ...common,
      title: "",
      issuer: "",
      year: "",
      accent: "",
    };
  }

  if (collectionName === "ventures") {
    return {
      ...common,
      title: "",
      type: "",
      tag: "Ecommerce",
      metrics: "",
      description: "",
      investmentRequired: "",
      longDescription: "",
    };
  }

  return {
    id: "main",
    siteName: "Thukha Aung",
    tagline: "",
    author: "Thukha Aung",
    siteUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    defaultOgImage: "",
    twitterHandle: "",
    googleSiteVerification: "",
  };
}

function documentTitle(
  item: DocumentData,
): string {
  return String(
    item.title ||
      item.organization ||
      item.siteName ||
      item.id,
  );
}

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeCollection, setActiveCollection] =
    useState<CollectionName>("projects");

  const [documents, setDocuments] = useState<
    DocumentData[]
  >([]);

  const [selected, setSelected] =
    useState<DocumentData | null>(null);

  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] =
    useState<number | null>(null);

  useEffect(() => {
    if (!auth) {
      setAuthLoaded(true);
      return;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!db || !user) return;

    return onSnapshot(
      collection(db, activeCollection),

      (snapshot) => {
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as DocumentData[];

        items.sort(
          (first, second) =>
            Number(first.order ?? 999) -
            Number(second.order ?? 999),
        );

        setDocuments(items);

        setSelected((current) => {
          if (!current) return items[0] || null;

          return (
            items.find(
              (item) => item.id === current.id,
            ) ||
            items[0] ||
            null
          );
        });
      },

      (firebaseError) => {
        setMessage(firebaseError.message);
      },
    );
  }, [activeCollection, user]);

  async function login(event: FormEvent) {
    event.preventDefault();

    if (!auth) return;

    setError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed",
      );
    }
  }

  function updateField(
    field: string,
    value: unknown,
  ) {
    setSelected((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : null,
    );
  }

  async function saveDocument() {
    if (!db || !selected) return;

    const { id, ...content } = selected;

    if (!id.trim()) {
      setMessage("Document ID is required");
      return;
    }

    try {
      await setDoc(
        doc(db, activeCollection, id),
        {
          ...content,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setMessage("Saved successfully");
    } catch (saveError) {
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : "Save failed",
      );
    }
  }

  async function removeDocument() {
    if (!db || !selected) return;

    const confirmed = window.confirm(
      `Delete "${documentTitle(selected)}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, activeCollection, selected.id),
      );

      setSelected(null);
      setMessage("Deleted successfully");
    } catch (deleteError) {
      setMessage(
        deleteError instanceof Error
          ? deleteError.message
          : "Delete failed",
      );
    }
  }

  function uploadMedia(
    file: File,
    fieldName: string,
  ) {
    if (!storage || !selected) return;

    const safeName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-",
    );

    const storageReference = ref(
      storage,
      `portfolio/${activeCollection}/${selected.id}/${Date.now()}-${safeName}`,
    );

    const uploadTask = uploadBytesResumable(
      storageReference,
      file,
      {
        contentType: file.type,
      },
    );

    setUploadProgress(0);

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const percentage = Math.round(
          (snapshot.bytesTransferred /
            snapshot.totalBytes) *
            100,
        );

        setUploadProgress(percentage);
      },

      (uploadError) => {
        setMessage(uploadError.message);
        setUploadProgress(null);
      },

      async () => {
        const downloadURL = await getDownloadURL(
          uploadTask.snapshot.ref,
        );

        updateField(fieldName, downloadURL);

        setUploadProgress(null);

        setMessage(
          "Upload finished. Save the document.",
        );
      },
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <AdminMessage
        title="Firebase configuration missing"
        text="Add the Firebase environment variables in Vercel."
      />
    );
  }

  if (!authLoaded) {
    return (
      <AdminMessage
        title="Loading admin"
        text="Checking Firebase login session."
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
        <form
          onSubmit={login}
          className="w-full max-w-md bg-[#0e1422] border border-slate-800 rounded-2xl p-8 space-y-5"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-400"
          >
            <ArrowLeft size={14} />
            Back to website
          </a>

          <div>
            <p className="text-xs text-emerald-400 uppercase">
              Secure Firebase CMS
            </p>

            <h1 className="text-2xl font-bold mt-1">
              Portfolio Admin
            </h1>
          </div>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Admin email"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3"
          />

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-3 font-bold">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      <header className="border-b border-slate-800 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-emerald-400">
            Firebase CMS
          </p>

          <h1 className="text-xl font-bold text-white">
            Portfolio Admin
          </h1>
        </div>

        <div className="flex gap-2">
          <a
            href="/"
            className="border border-slate-700 rounded-lg px-3 py-2 text-xs"
          >
            View site
          </a>

          <button
            onClick={() => auth && signOut(auth)}
            className="border border-slate-700 rounded-lg px-3 py-2 text-xs flex items-center gap-2"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[220px_300px_1fr] min-h-[calc(100vh-80px)]">
        <aside className="border-r border-slate-800 p-4 space-y-2">
          {cmsCollections.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCollection(item.id);
                setSelected(null);
                setMessage("");
              }}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-xs ${
                activeCollection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <aside className="border-r border-slate-800 p-4">
          <button
            onClick={() =>
              setSelected(
                createBlank(activeCollection),
              )
            }
            className="w-full bg-emerald-600 rounded-lg px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 mb-4"
          >
            <Plus size={14} />
            New document
          </button>

          <div className="space-y-2">
            {documents.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left border rounded-lg p-3 text-xs ${
                  selected?.id === item.id
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-800 text-slate-400"
                }`}
              >
                <span className="block truncate font-semibold">
                  {documentTitle(item)}
                </span>

                <span className="block truncate text-slate-600 mt-1">
                  {item.id}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className="p-5 sm:p-8 max-w-4xl">
          {!selected ? (
            <p className="text-sm text-slate-500">
              Select or create a document.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-emerald-400">
                    {activeCollection}
                  </p>

                  <h2 className="text-xl font-bold text-white">
                    {documentTitle(selected)}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={removeDocument}
                    className="border border-red-900 text-red-400 rounded-lg px-3 py-2 text-xs flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                  <button
                    onClick={saveDocument}
                    className="bg-blue-600 rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              </div>

              {message && (
                <div className="border border-slate-800 bg-slate-900 rounded-lg p-3 text-xs">
                  {message}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(selected)
                  .filter(
                    ([field]) =>
                      field !== "createdAt" &&
                      field !== "updatedAt",
                  )
                  .map(([field, value]) => (
                    <FieldEditor
                      key={field}
                      field={field}
                      value={value}
                      onChange={(newValue) =>
                        updateField(field, newValue)
                      }
                    />
                  ))}
              </div>

              <div className="border border-slate-800 rounded-xl p-5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Upload size={16} />
                  Upload image or video
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <select
                    id="upload-field"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="coverImage">
                      coverImage
                    </option>

                    <option value="imageUrl">
                      imageUrl
                    </option>

                    <option value="videoUrl">
                      videoUrl
                    </option>

                    <option value="ogImage">
                      ogImage
                    </option>

                    <option value="defaultOgImage">
                      defaultOgImage
                    </option>
                  </select>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="text-xs"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      const field =
                        (
                          document.getElementById(
                            "upload-field",
                          ) as HTMLSelectElement
                        )?.value || "imageUrl";

                      if (file) {
                        uploadMedia(file, field);
                      }
                    }}
                  />
                </div>

                {uploadProgress !== null && (
                  <p className="text-xs text-emerald-400 mt-3">
                    Uploading {uploadProgress}%
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const longFields = [
    "content",
    "description",
    "seoDescription",
    "fullDetails",
    "caseStudy",
    "longDescription",
    "excerpt",
  ];

  const isLong = longFields.includes(field);
  const fullWidth =
    isLong || Array.isArray(value);

  return (
    <label
      className={`space-y-1 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <span className="text-xs text-slate-500">
        {field}
      </span>

      {typeof value === "boolean" ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="block h-5 w-5"
        />
      ) : Array.isArray(value) ? (
        <textarea
          value={value.join("\n")}
          onChange={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            )
          }
          placeholder="One item per line"
          rows={5}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs"
        />
      ) : isLong ? (
        <textarea
          value={String(value ?? "")}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={field === "content" ? 14 : 6}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs"
        />
      ) : (
        <input
          type={
            typeof value === "number"
              ? "number"
              : "text"
          }
          value={String(value ?? "")}
          disabled={field === "id"}
          onChange={(event) =>
            onChange(
              typeof value === "number"
                ? Number(event.target.value)
                : event.target.value,
            )
          }
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs disabled:opacity-60"
        />
      )}
    </label>
  );
}

function AdminMessage({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-6">
      <div className="max-w-lg border border-slate-800 bg-[#0e1422] rounded-2xl p-8">
        <h1 className="text-xl font-bold">
          {title}
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          {text}
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 text-emerald-400 text-xs mt-5"
        >
          <ArrowLeft size={14} />
          Back to website
        </a>
      </div>
    </div>
  );
}
