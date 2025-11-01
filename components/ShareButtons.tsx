'use client';

import { ShareableCard } from '@/types';
import { Download, Share2, Twitter, Facebook } from 'lucide-react';

interface ShareButtonsProps {
  shareableCards: ShareableCard[];
  playerId: string;
}

export default function ShareButtons({ shareableCards, playerId }: ShareButtonsProps) {
  const handleDownload = async (cardId: string) => {
    // TODO: Implement download functionality using html2canvas
    console.log('Downloading card:', cardId);
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const text = encodeURIComponent('Check out my League of Legends Year in Review! 🎮');
    const url = encodeURIComponent(window.location.href);

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gradient mb-6">Share Your Journey</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {shareableCards.map((card) => (
          <div
            key={card.id}
            className="p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all cursor-pointer"
            onClick={() => handleDownload(card.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{card.title}</span>
              <Download size={20} />
            </div>
            <p className="text-sm text-gray-400">Click to download image</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg transition-colors"
        >
          <Twitter size={20} />
          Share on Twitter
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 px-6 py-3 bg-[#4267B2] hover:bg-[#365899] rounded-lg transition-colors"
        >
          <Facebook size={20} />
          Share on Facebook
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Share2 size={20} />
          Copy Link
        </button>
      </div>
    </div>
  );
}
