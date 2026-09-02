import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { BaseMatoran } from '../../types/Matoran';
import { buildCustomCharacterShareUrl } from '../../services/customCharacterShare';

type Props = {
  matoran: BaseMatoran;
};

export function CustomCharacterShareButton({ matoran }: Props) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = buildCustomCharacterShareUrl(matoran);
    setShareUrl(url);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // Clipboard unavailable; the URL is still visible in the panel below.
    }
  };

  const onCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="share-character-wrapper">
      <button
        type="button"
        className="share-character-btn"
        onClick={onShare}
        aria-label={`Share ${matoran.name}`}
        title={`Share ${matoran.name}`}
      >
        <Share2 size={16} /> Share
      </button>
      {shareUrl && (
        <div className="share-character-result" role="status">
          <input
            className="share-character-url"
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            className="share-character-copy"
            onClick={onCopy}
            aria-label="Copy share link"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
