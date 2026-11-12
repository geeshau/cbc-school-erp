import React, { useState } from 'react';
import {
  Globe,
  Edit3,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Layout,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  MessageCircle,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  File,
  Link as LinkIcon,
} from 'lucide-react';

export interface FeedbackComment {
  id: string;
  text: string;
  role: string;
  date: string;
  likes: number;
  visible: boolean;
}

export interface DownloadResource {
  id: string;
  title: string;
  description?: string;
  category: string; // e.g. 'Admissions', 'Fees', 'Calendar', 'Newsletters', 'Forms'
  fileName: string;
  fileType: string; // e.g. 'PDF', 'DOCX'
  fileSize: string; // display string e.g. '245 KB'
  url: string; // data URL (uploaded) or external link
  uploadedAt: string;
  visible: boolean;
}

export interface WebsiteContent {
  announcementText: string;
  phone: string;
  email: string;
  altEmail: string;
  heroTitle: string;
  heroSubtitle: string;
  location: string;
  admissionLabel?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  galleryImages: { id: string; title: string; url: string; category: string }[];
  feedbackComments?: FeedbackComment[];
  downloadResources?: DownloadResource[];
}

interface WebsiteContentManagerProps {
  content: WebsiteContent;
  onSaveContent: (newContent: WebsiteContent) => void;
}

export const WebsiteContentManager: React.FC<WebsiteContentManagerProps> = ({
  content,
  onSaveContent
}) => {
  const [formData, setFormData] = useState<WebsiteContent>({ ...content });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New gallery item state
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('Campus');

  // New feedback item state
  const [newFbText, setNewFbText] = useState('');
  const [newFbRole, setNewFbRole] = useState('');
  const [editingFbId, setEditingFbId] = useState<string | null>(null);
  const [editFbText, setEditFbText] = useState('');
  const [editFbRole, setEditFbRole] = useState('');

  // New download resource state
  const [newResTitle, setNewResTitle] = useState('');
  const [newResDescription, setNewResDescription] = useState('');
  const [newResCategory, setNewResCategory] = useState('Admissions');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResFile, setNewResFile] = useState<{ name: string; type: string; size: string; dataUrl: string } | null>(null);
  const [resUploadError, setResUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const extractFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    return ext.length <= 5 ? ext : 'FILE';
  };

  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResUploadError(null);
    if (file.size > MAX_FILE_BYTES) {
      setResUploadError('File is too large. Maximum upload size is 5 MB. For larger files, host externally and paste the link instead.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewResFile({
        name: file.name,
        type: extractFileType(file.name),
        size: formatFileSize(file.size),
        dataUrl: String(reader.result),
      });
      setNewResUrl('');
      if (!newResTitle.trim()) {
        setNewResTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.onerror = () => setResUploadError('Could not read the selected file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleAddResource = () => {
    setResUploadError(null);
    if (!newResTitle.trim()) {
      setResUploadError('Please provide a resource title.');
      return;
    }
    if (!newResFile && !newResUrl.trim()) {
      setResUploadError('Please upload a file or paste an external file link.');
      return;
    }
    const newItem: DownloadResource = {
      id: `res_${Date.now()}`,
      title: newResTitle.trim(),
      description: newResDescription.trim() || undefined,
      category: newResCategory,
      fileName: newResFile ? newResFile.name : (newResUrl.split('/').pop()?.split('?')[0] || 'resource'),
      fileType: newResFile ? newResFile.type : extractFileType(newResUrl.split('?')[0]),
      fileSize: newResFile ? newResFile.size : 'External Link',
      url: newResFile ? newResFile.dataUrl : newResUrl.trim(),
      uploadedAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      visible: true,
    };
    setFormData((prev) => ({
      ...prev,
      downloadResources: [newItem, ...(prev.downloadResources || [])],
    }));
    setNewResTitle('');
    setNewResDescription('');
    setNewResUrl('');
    setNewResFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveResource = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      downloadResources: (prev.downloadResources || []).filter((r) => r.id !== id),
    }));
  };

  const handleToggleResourceVisibility = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      downloadResources: (prev.downloadResources || []).map((r) =>
        r.id === id ? { ...r, visible: !r.visible } : r
      ),
    }));
  };

  const handleChange = (field: keyof WebsiteContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFeedback = () => {
    if (!newFbText.trim()) return;
    const newItem: FeedbackComment = {
      id: String(Date.now()),
      text: newFbText.trim(),
      role: newFbRole.trim() || 'Anonymous Parent',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      likes: 0,
      visible: true,
    };
    setFormData((prev) => ({
      ...prev,
      feedbackComments: [newItem, ...(prev.feedbackComments || [])],
    }));
    setNewFbText('');
    setNewFbRole('');
  };

  const handleRemoveFeedback = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      feedbackComments: (prev.feedbackComments || []).filter((fb) => fb.id !== id),
    }));
  };

  const handleToggleFbVisibility = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      feedbackComments: (prev.feedbackComments || []).map((fb) =>
        fb.id === id ? { ...fb, visible: !fb.visible } : fb
      ),
    }));
  };

  const handleMoveFeedback = (id: string, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const items = [...(prev.feedbackComments || [])];
      const idx = items.findIndex((fb) => fb.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= items.length) return prev;
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      return { ...prev, feedbackComments: items };
    });
  };

  const handleStartEditFeedback = (fb: FeedbackComment) => {
    setEditingFbId(fb.id);
    setEditFbText(fb.text);
    setEditFbRole(fb.role);
  };

  const handleSaveEditFeedback = () => {
    if (!editingFbId || !editFbText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      feedbackComments: (prev.feedbackComments || []).map((fb) =>
        fb.id === editingFbId
          ? { ...fb, text: editFbText.trim(), role: editFbRole.trim() || 'Anonymous Parent' }
          : fb
      ),
    }));
    setEditingFbId(null);
    setEditFbText('');
    setEditFbRole('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    setSuccessMessage('Website content successfully updated and published to kindergarten.pceastandrews.org!');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageTitle || !newImageUrl) {
      alert('Please provide both image title and image URL.');
      return;
    }
    const newItem = {
      id: String(Date.now()),
      title: newImageTitle,
      url: newImageUrl,
      category: newImageCategory
    };
    setFormData((prev) => ({
      ...prev,
      galleryImages: [newItem, ...prev.galleryImages]
    }));
    setNewImageTitle('');
    setNewImageUrl('');
  };

  const handleRemoveImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img.id !== id)
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-brand-950 p-6 rounded-2xl border border-slate-200/80 dark:border-brand-900 flex flex-wrap items-center justify-between gap-4 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Website Content Management (CMS)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage public landing page details, announcements, contact info, and photo gallery for kindergarten.pceastandrews.org
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 border border-brand-200 dark:border-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Preview Live Site</span>
          </a>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact & General Info */}
        <div className="bg-white dark:bg-brand-950 p-6 rounded-2xl border border-slate-200/80 dark:border-brand-900 space-y-4 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-500" />
            <span>Contact Information & Top Banner</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alternative Email Address
              </label>
              <input
                type="email"
                value={formData.altEmail}
                onChange={(e) => handleChange('altEmail', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Physical Address / Domain Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Hero & Overview Copy</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Admissions Badge / Label
              </label>
              <input
                type="text"
                value={formData.admissionLabel || ''}
                onChange={(e) => handleChange('admissionLabel', e.target.value)}
                placeholder="e.g. Admissions Open"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Optional. Leave blank to use a neutral “Admissions Open” label in the hero.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hero Subtitle / Introduction Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Hero CTA Label
                </label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaLabel || ''}
                  onChange={(e) => handleChange('heroPrimaryCtaLabel', e.target.value)}
                  placeholder="e.g. Enquire About Admissions"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Hero CTA Label
                </label>
                <input
                  type="text"
                  value={formData.heroSecondaryCtaLabel || ''}
                  onChange={(e) => handleChange('heroSecondaryCtaLabel', e.target.value)}
                  placeholder="e.g. Request Child Report"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">CTA labels are optional; existing button destinations remain unchanged.</p>
          </div>
        </div>

        {/* Gallery Photos Management */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-500" />
              <span>Campus Photo Gallery Manager</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">{formData.galleryImages.length} Photos</span>
          </div>

          {/* Add New Photo Form */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Gallery Image</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Photo Title (e.g. Montessori Class)"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <input
                type="text"
                placeholder="Image URL (Unsplash link)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <div className="flex gap-2">
                <select
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs flex-1"
                >
                  <option value="Campus">Campus</option>
                  <option value="Activities">Activities</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Spiritual">Spiritual</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-brand-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Existing Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.galleryImages.map((img) => (
              <div
                key={img.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex flex-col justify-between"
              >
                <div className="h-32 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                    {img.category}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{img.title}</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer shrink-0"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads & Resources Manager */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-500" />
              <span>Downloads & Resources Manager</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              {(formData.downloadResources || []).filter((r) => r.visible).length} Visible / {(formData.downloadResources || []).length} Total
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-2">
            Upload files (fee structures, admission forms, term calendars, newsletters, uniform lists) that parents can download from the public landing page.
          </p>

          {/* Add New Resource Form */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload New Resource</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Resource Title (e.g. 2026 Fee Structure)"
                value={newResTitle}
                onChange={(e) => setNewResTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <select
                value={newResCategory}
                onChange={(e) => setNewResCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="Admissions">Admissions</option>
                <option value="Fees">Fees</option>
                <option value="Calendar">Calendar</option>
                <option value="Newsletters">Newsletters</option>
                <option value="Forms">Forms</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Short description (optional)"
              value={newResDescription}
              onChange={(e) => setNewResDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {/* File upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip,.txt,.csv"
                  onChange={handleResourceFileSelect}
                  className="hidden"
                  id="resource-file-input"
                />
                <label
                  htmlFor="resource-file-input"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {newResFile ? (
                    <span className="truncate max-w-[200px]">{newResFile.name} ({newResFile.size})</span>
                  ) : (
                    <span>Choose File to Upload (max 5 MB)</span>
                  )}
                </label>
              </div>
              {/* OR external link */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="…or paste external file URL"
                    value={newResUrl}
                    onChange={(e) => { setNewResUrl(e.target.value); if (e.target.value) setNewResFile(null); }}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-brand-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
            {resUploadError && (
              <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">{resUploadError}</p>
            )}
          </div>

          {/* Resources List */}
          <div className="space-y-2.5">
            {(formData.downloadResources || []).map((res) => (
              <div
                key={res.id}
                className={`rounded-xl border p-4 flex items-center gap-3 transition-all ${
                  res.visible
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    : 'border-slate-200/50 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 opacity-60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{res.title}</h5>
                    <span className="px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[9px] font-bold uppercase shrink-0">
                      {res.category}
                    </span>
                  </div>
                  {res.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{res.description}</p>
                  )}
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-bold">{res.fileType}</span>
                    <span>·</span>
                    <span>{res.fileSize}</span>
                    <span>·</span>
                    <span>Added {res.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={res.url}
                    download={res.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Preview / download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleToggleResourceVisibility(res.id)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      res.visible
                        ? 'text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={res.visible ? 'Hide from landing page' : 'Show on landing page'}
                  >
                    {res.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(res.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    title="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(formData.downloadResources || []).length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">
                No downloadable resources yet. Upload a file or add an external link above.
              </p>
            )}
          </div>
        </div>

        {/* Parent Feedback / Testimonial Cards Manager */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 rounded-tr-[2rem] shadow-[0_10px_40px_-24px_rgba(13,40,64,0.35)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-500" />
              <span>Parent Feedback Cards (Carousel)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              {(formData.feedbackComments || []).filter((fb) => fb.visible).length} Visible / {(formData.feedbackComments || []).length} Total
            </span>
          </div>

          {/* Add New Feedback */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Feedback Card</h4>
            <div className="space-y-3">
              <textarea
                placeholder="Write the parent feedback comment..."
                value={newFbText}
                onChange={(e) => setNewFbText(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Role label (e.g. Parent — PP2)"
                  value={newFbRole}
                  onChange={(e) => setNewFbRole(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-brand-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Card
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Cards List */}
          <div className="space-y-2.5">
            {(formData.feedbackComments || []).map((fb, idx) => (
              <div
                key={fb.id}
                className={`rounded-xl border p-4 transition-all ${
                  fb.visible
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    : 'border-slate-200/50 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 opacity-60'
                } ${editingFbId === fb.id ? 'ring-2 ring-brand-500/40' : ''}`}
              >
                {editingFbId === fb.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <textarea
                      value={editFbText}
                      onChange={(e) => setEditFbText(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editFbRole}
                        onChange={(e) => setEditFbRole(e.target.value)}
                        placeholder="Role label"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSaveEditFeedback}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFbId(null)}
                        className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-start gap-3">
                    {/* Reorder Handle */}
                    <div className="flex flex-col gap-0.5 pt-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveFeedback(fb.id, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 rounded text-slate-400 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFeedback(fb.id, 'down')}
                        disabled={idx === (formData.feedbackComments || []).length - 1}
                        className="p-0.5 rounded text-slate-400 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-2">
                        &ldquo;{fb.text}&rdquo;
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-500 dark:text-slate-400">{fb.role}</span>
                        <span>·</span>
                        <span>{fb.date}</span>
                        <span>·</span>
                        <span>{fb.likes} likes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFbVisibility(fb.id)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          fb.visible
                            ? 'text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={fb.visible ? 'Hide from landing page' : 'Show on landing page'}
                      >
                        {fb.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEditFeedback(fb)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit feedback"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeedback(fb.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(formData.feedbackComments || []).length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">
                No feedback cards yet. Add one above to get started.
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl text-xs font-black text-brand-900 bg-accent-500 hover:bg-accent-400 shadow-lg shadow-brand-600/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Website Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
