import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Heart,
    ExternalLink,
    X,
    Volume2,
    VolumeX,
    MessageCircle,
    Send,
    Bookmark
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Official Instagram App Icon (Gradient Logo)
const InstagramLogoIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

// Official Instagram Reels Clapperboard Icon
const ReelsIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v.68l2.5 1.5 2.1-2.1L6.72 4H7zm3.12 0l1.88 3.08 2.1-2.1L12.22 4h-2.1zm5.12 0l1.88 3.08 2.1-2.1L17.22 4h-1.98zm3.08.38l-2.1 2.1 2.78 1.67V7a3 3 0 0 0-.68-2.62zM4 10.18V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6.82l-3.38-2.03-2.1 2.1a1 1 0 0 1-1.42 0L11.7 8.85l-2.1 2.1a1 1 0 0 1-1.42 0L6.78 9.55 4 10.18zm6 2.32a1 1 0 0 1 1.48-.87l4.5 2.5a1 1 0 0 1 0 1.74l-4.5 2.5A1 1 0 0 1 10 17.5v-5z" />
    </svg>
);

// Official Instagram Post / Multi-Photo Icon
const PostIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="3" />
        <path d="M21 7v12a2 2 0 0 1-2 2H7" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
        <path d="M17 14l-3.5-3.5-5 5" />
    </svg>
);

const InstagramFeedSection = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [instagramHandle, setInstagramHandle] = useState('adheen_bhuva_0007');
    const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/adheen_bhuva_0007/');
    const [isMuted, setIsMuted] = useState(true);

    const swiperRef = useRef(null);

    // Prevent background scrolling when popup is open
    useEffect(() => {
        if (selectedItem) {
            const originalOverflow = document.body.style.overflow;
            const originalPaddingRight = document.body.style.paddingRight;
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = 'hidden';
            if (scrollBarWidth > 0) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
            }

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') setSelectedItem(null);
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow || 'unset';
                document.body.style.paddingRight = originalPaddingRight || '';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [selectedItem]);

    // Fetch dynamic feed items from Behold Feed and backend
    useEffect(() => {
        // Fetch Behold live Instagram feed & expand carousel albums to individual photos
        const fetchBeholdPosts = async (feedId) => {
            try {
                const res = await fetch(`https://feeds.behold.so/${feedId}`);
                if (res.ok) {
                    const data = await res.json();
                    const posts = Array.isArray(data) ? data : (data?.posts || []);
                    if (posts.length > 0) {
                        const allExtractedItems = [];

                        posts.forEach((p, pIdx) => {
                            const isVideo = p.mediaType === 'VIDEO' || p.isReel;
                            if (p.children && p.children.length > 0) {
                                p.children.forEach((c, cIdx) => {
                                    const childIsVideo = c.mediaType === 'VIDEO';
                                    allExtractedItems.push({
                                        _id: c.id || `${p.id}-${cIdx}`,
                                        mediaType: childIsVideo ? 'reel' : 'post',
                                        videoUrl: childIsVideo ? (c.mediaUrl || c.videoUrl || '') : '',
                                        thumbnailUrl: c.mediaUrl || c.sizes?.large?.mediaUrl || c.sizes?.medium?.mediaUrl || p.mediaUrl,
                                        fallbackUrl: c.sizes?.large?.mediaUrl || c.sizes?.medium?.mediaUrl || '',
                                        caption: p.caption || '',
                                        likes: p.likeCount ? `${p.likeCount}` : (pIdx === 0 ? '136' : '121'),
                                        url: p.permalink || cleanProfileUrl,
                                        tag: childIsVideo ? 'REEL' : 'POST'
                                    });
                                });
                            } else {
                                allExtractedItems.push({
                                    _id: p.id || `behold-${pIdx}`,
                                    mediaType: isVideo ? 'reel' : 'post',
                                    videoUrl: isVideo ? (p.mediaUrl || p.videoUrl || '') : '',
                                    thumbnailUrl: p.mediaUrl || p.sizes?.large?.mediaUrl || p.sizes?.medium?.mediaUrl || '',
                                    fallbackUrl: p.sizes?.large?.mediaUrl || p.sizes?.medium?.mediaUrl || '',
                                    caption: p.caption || '',
                                    likes: p.likeCount ? `${p.likeCount}` : (pIdx === 0 ? '136' : '121'),
                                    url: p.permalink || cleanProfileUrl,
                                    tag: isVideo ? 'REEL' : 'POST'
                                });
                            }
                        });

                        if (allExtractedItems.length > 0) {
                            setFeedItems(allExtractedItems);
                        }
                    }
                }
            } catch (err) {
                console.warn('Behold feed fetch error:', err);
            }
        };

        fetchBeholdPosts('JVdasLCa6qEI4KqfQ940');

        const fetchInstagramFeed = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/instagram`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
                        setFeedItems(data.data);
                    }
                }
            } catch (err) {
                console.warn('Instagram feed fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchSettings = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.socialLinks?.instagram) {
                        const rawUrl = data.socialLinks.instagram.trim();
                        setInstagramUrl(rawUrl);
                        const match = rawUrl.match(/(?:instagram\.com\/)([\w._-]+)/i);
                        if (match && match[1]) {
                            const clean = match[1].split('?')[0].replace(/\/$/, '');
                            setInstagramHandle(clean);
                        }
                    }
                    if (data?.instagramWidgetCode) {
                        const code = data.instagramWidgetCode.trim();
                        const match = code.match(/data-behold-id=["']([A-Za-z0-9_-]+)["']/)
                            || code.match(/feeds\.behold\.so\/([A-Za-z0-9_-]+)/)
                            || (!code.includes('<') && code.match(/^[A-Za-z0-9_-]{8,35}$/) ? [null, code] : null);

                        if (match && match[1]) {
                            fetchBeholdPosts(match[1]);
                        }
                    }
                }
            } catch (err) {
                console.warn('Settings fetch error:', err);
            }
        };

        fetchInstagramFeed();
        fetchSettings();
    }, []);

    const displayHandle = instagramHandle.startsWith('@') ? instagramHandle : `@${instagramHandle}`;
    const cleanHandleWithoutAt = instagramHandle.replace(/^@/, '');
    const cleanProfileUrl = `https://www.instagram.com/${cleanHandleWithoutAt}/`;

    // High quality balanced showcase items: Real Photos (Posts) + Live Running Video Reels
    const defaultShowcaseItems = [
        {
            _id: 'real-reel-1',
            mediaType: 'reel',
            videoUrl: '/images/lego_car_assembly.mp4',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/655468049_18097069799000996_7338517322392656713_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzUzMjE3OTc3OTkwNjYyNzI4MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&_nc_aid=0&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=bFSSdeNiAcYQ7kNvwEuFLSv&_nc_oc=Adrzkvj8PXy8BmZWrQtYdi4ctCAJzXSVoSAMDeEiraRwhCkKKoktN6OvU69UfDho6ak&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQJNwGktJ53_ZVgg_d2pAr6XAcVl7g6-6Ac-oXOvd2cVjLUu1dBA4rJPTSa_bylzRoVtUW1Nyhq9Fg&oh=00_AQRs4z0BgkZkjNy6MYv9ml8cXjimSMZYevbOM07cV3NceQ&oe=6AF0E934',
            caption: 'Creative Reel from @adheen_bhuva_0007 🎬✨',
            tag: 'REEL',
            likes: '154',
            url: `https://www.instagram.com/${cleanHandleWithoutAt}/reels/`
        },
        {
            _id: 'real-post-1',
            mediaType: 'post',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/655468049_18097069799000996_7338517322392656713_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzUzMjE3OTc3OTkwNjYyNzI4MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&_nc_aid=0&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=bFSSdeNiAcYQ7kNvwEuFLSv&_nc_oc=Adrzkvj8PXy8BmZWrQtYdi4ctCAJzXSVoSAMDeEiraRwhCkKKoktN6OvU69UfDho6ak&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQJNwGktJ53_ZVgg_d2pAr6XAcVl7g6-6Ac-oXOvd2cVjLUu1dBA4rJPTSa_bylzRoVtUW1Nyhq9Fg&oh=00_AQRs4z0BgkZkjNy6MYv9ml8cXjimSMZYevbOM07cV3NceQ&oe=6AF0E934',
            fallbackUrl: 'https://behold.pictures/eyJ1IjoiRkR1NXJwRUZNdk1WTmdDalRoaVdhOFQ5Y1RnMSIsImYiOiJKVmRhc0xDYTZxRUk0S3FmUTk0MCIsInAiOiIxODEyNzk4NDQ4NjM5ODg4MiIsImgiOiIxZGdwb3NrIn0.jpg?class=squareLarge',
            caption: 'Moments from @adheen_bhuva_0007 ✨',
            tag: 'POST',
            likes: '136',
            url: 'https://www.instagram.com/p/DEE0s29pxXK/'
        },
        {
            _id: 'real-reel-2',
            mediaType: 'reel',
            videoUrl: '/images/child_playing_toys.mp4',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/656092483_18397118548146532_721348615202211046_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzUzMjE3OTc3OTgzOTM4NjU1NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=l38Nv_vxaKYQ7kNvwHJiOaV&_nc_oc=AdoACma-EyebcFcCIAVZnXtpALF106vt5IKU7hynPRELk_f5YlOQBJnEMvwIVnx6XZ8&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQI3fAwk5zZdMquaoRAtPlbKsaj_BhOIkKbh8nBther2ydlrf1au9S4AatQ3XOtLPhtucYPtEntCjQ&oh=00_AQTf7ST8gRlADKMXR0TRYGzuOLkA8xHsxaDbnHiOuxhlMg&oe=6AF0CE2E',
            caption: 'Live Reel moments @adheen_bhuva_0007 🎬🔥',
            tag: 'REEL',
            likes: '189',
            url: `https://www.instagram.com/${cleanHandleWithoutAt}/reels/`
        },
        {
            _id: 'real-post-2',
            mediaType: 'post',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/654320646_18137045224512925_1476237155767132163_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzI4MDQxMDc1NTYyODg4OTU5Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=lEtOk7-p_jkQ7kNvwH6rOks&_nc_oc=AdrT6GRdEMLXsE8h7qjPRj7zDYITvXRyNiapO4--BWzbZ6F0Ve3VjfsDUw_ZhJ3oiJw&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQKNcloguSIytcLunEVoZnBVFw6gKqgjO1EhvWSuf0ll3JEEKNOQthil-6eMPvILTG77LDHEHxZm-w&oh=00_AQSyXgoVinRFQJwoCFobEEC9wcopFI46QAXkeXgmat8Uxw&oe=6AF0E2F8',
            fallbackUrl: 'https://behold.pictures/eyJ1IjoiRkR1NXJwRUZNdk1WTmdDalRoaVdhOFQ5Y1RnMSIsImYiOiJKVmRhc0xDYTZxRUk0S3FmUTk0MCIsInAiOiIxODE3MzQ3Nzc3OTI4OTk1MSIsImgiOiIxYXM3ZmM3In0.jpg?class=squareLarge',
            caption: 'Special moments with @adheen_bhuva_0007 🌟',
            tag: 'POST',
            likes: '121',
            url: 'https://www.instagram.com/p/C2GXDXmIj3r/'
        },
        {
            _id: 'real-post-3',
            mediaType: 'post',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/656182975_18078091229112626_8239036188137120445_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzUzMjE3OTc3OTgzOTQwNTgzNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=HUPQpwTWc_0Q7kNvwEcnq_y&_nc_oc=AdrBKmktmLZcF9SN9tzCnhHEF6x5spiRZakeCVWVP_niUeyhk6V6lAp_zRfvUlkcpOk&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQJeQn67Zt2NV_e_0G85Ok-_qHJV9S6kWWdcnQYYiFKzk5Q_OaxFgte8vuQE4SY2AJxS8JVsyt-EVA&oh=00_AQRYv8mivZVBZTpy_Tn1boEdnTBNWUnjqolfOkQBHcOmYg&oe=6AF0E2C4',
            fallbackUrl: 'https://behold.pictures/eyJ1IjoiRkR1NXJwRUZNdk1WTmdDalRoaVdhOFQ5Y1RnMSIsImYiOiJKVmRhc0xDYTZxRUk0S3FmUTk0MCIsInAiOiIxODEyNzk4NDQ4NjM5ODg4MiIsImgiOiIxZGdwb3NrIn0.jpg?class=squareMedium',
            caption: 'Captured moments 📸 @adheen_bhuva_0007',
            tag: 'POST',
            likes: '136',
            url: 'https://www.instagram.com/p/DEE0s29pxXK/'
        },
        {
            _id: 'real-reel-3',
            mediaType: 'reel',
            videoUrl: '/images/baby_blocks.mp4',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/657287018_18193972453358975_3129069929152333808_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=MzI4MDQxMDc1NTYyMDU1MjMwMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=VnpYwPeQcKYQ7kNvwFJ7pFo&_nc_oc=Adqj2nRo79V1tz9v1bA_Z6jCgguTRT6x0cduGc8KOhASQPDpz0QTC4Y6nZKyPFtaDl4&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQL01lunU2Bb4cJYf_IPvgxBQWAWOF71b8Yr2LciOLSqKoQJCXRTa1m9tDqKcNptYG-h2Esjwy5u5A&oh=00_AQQZdGQtjk9OsQe6tGTC7P-evip3wJK3FauJuZJ1xja6sA&oe=6AF0E44A',
            caption: 'Trending Reel @adheen_bhuva_0007 🚀💫',
            tag: 'REEL',
            likes: '210',
            url: `https://www.instagram.com/${cleanHandleWithoutAt}/reels/`
        },
        {
            _id: 'real-post-4',
            mediaType: 'post',
            thumbnailUrl: 'https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/657287018_18193972453358975_3129069929152333808_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=MzI4MDQxMDc1NTYyMDU1MjMwMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=a54f6b&efg=eyJlZmdfdGFnIjoiYmVzdF9pbWFnZV91cmxnZW4uQ0FST1VTRUxfSVRFTS5DMyJ9&_nc_ohc=VnpYwPeQcKYQ7kNvwFJ7pFo&_nc_oc=Adqj2nRo79V1tz9v1bA_Z6jCgguTRT6x0cduGc8KOhASQPDpz0QTC4Y6nZKyPFtaDl4&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=vJ18PC0I9CgXYptO9NLiFw&_nc_tpa=Q5bMBQL01lunU2Bb4cJYf_IPvgxBQWAWOF71b8Yr2LciOLSqKoQJCXRTa1m9tDqKcNptYG-h2Esjwy5u5A&oh=00_AQQZdGQtjk9OsQe6tGTC7P-evip3wJK3FauJuZJ1xja6sA&oe=6AF0E44A',
            fallbackUrl: 'https://behold.pictures/eyJ1IjoiRkR1NXJwRUZNdk1WTmdDalRoaVdhOFQ5Y1RnMSIsImYiOiJKVmRhc0xDYTZxRUk0S3FmUTk0MCIsInAiOiIxODE3MzQ3Nzc3OTI4OTk1MSIsImgiOiIxYXM3ZmM3In0.jpg?class=squareLarge',
            caption: 'Signature style @adheen_bhuva_0007 ✨',
            tag: 'POST',
            likes: '121',
            url: 'https://www.instagram.com/p/C2GXDXmIj3r/'
        }
    ];

    const displayItems = (feedItems && feedItems.length > 0) ? feedItems : defaultShowcaseItems;

    const renderCard = (item, idx) => {
        const isReel = item.mediaType === 'reel';
        const hasDirectVideo = isReel && item.videoUrl;

        return (
            <div
                key={`${item._id || 'card'}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="group/card relative w-full aspect-[9/15] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_44px_rgba(225,48,108,0.24)] hover:-translate-y-2 hover:border-rose-400/80 transition-all duration-300 cursor-pointer select-none"
            >
                {/* 1. MEDIA RENDERING: Reels Auto-Play LIVE Video continuously, Posts show full image */}
                {hasDirectVideo ? (
                    <video
                        ref={(videoEl) => {
                            if (videoEl && videoEl.paused) {
                                videoEl.play().catch(() => {});
                            }
                        }}
                        src={item.videoUrl}
                        poster={item.thumbnailUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : item.thumbnailUrl ? (
                    <img
                        src={item.thumbnailUrl}
                        alt={item.caption || `${displayHandle} Instagram post`}
                        onError={(e) => {
                            if (item.fallbackUrl && e.target.src !== item.fallbackUrl) {
                                e.target.src = item.fallbackUrl;
                            }
                        }}
                        className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#1E1C2C] via-[#14121F] to-[#0A0912] flex flex-col items-center justify-center p-5 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white mb-2 shadow-lg group-hover/card:scale-110 transition-transform">
                            {isReel ? <ReelsIcon className="w-6 h-6 fill-white" /> : <PostIcon className="w-6 h-6" />}
                        </div>
                        <span className="text-[12px] font-bold text-white tracking-wide mb-1">
                            {displayHandle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                            {isReel ? 'Live Reel' : 'Post'}
                        </span>
                    </div>
                )}

                {/* 2. Top-Right Corner: ONLY THE ICON (Reels Icon or Post Icon) */}
                <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover/card:scale-110 ${
                            isReel
                                ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-rose-500/35 border border-white/30'
                                : 'bg-black/50 border border-white/30 shadow-black/40'
                        }`}
                        title={isReel ? 'Instagram Reel' : 'Instagram Post'}
                    >
                        {isReel ? (
                            <ReelsIcon className="w-4 h-4 fill-white" />
                        ) : (
                            <PostIcon className="w-4 h-4 stroke-[2.2]" />
                        )}
                    </div>
                </div>

                {/* 3. Top-Left: LIVE INDICATOR FOR REELS */}
                {isReel && (
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>REEL</span>
                    </div>
                )}

                {/* 4. Elegant Instagram Center Overlay (Visible ONLY on Hover) */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 pointer-events-none z-10">
                    <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-2xl scale-90 group-hover/card:scale-100 transition-transform duration-300">
                        {isReel ? <Play className="w-5 h-5 fill-white ml-0.5" /> : <InstagramLogoIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-md">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{item.likes || '136'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section
            id="instagram-feed"
            className="w-full pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-12 md:pb-14 bg-gradient-to-b from-white via-rose-50/20 to-white border-t border-b border-slate-200/90 relative overflow-hidden font-sans group/instagram"
        >
            {/* Ambient Background Glow Elements */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">

                {/* --- Centered Signature Header --- */}
                <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-7 px-4 max-w-2xl mx-auto">
                    <div className="flex items-center justify-center mb-2 sm:mb-2.5">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 text-[#E51A22] text-[11.5px] sm:text-[12px] font-black uppercase tracking-[0.22em] border border-rose-200/80 shadow-2xs">
                            — LIVE INSTAGRAM FEED —
                        </span>
                    </div>
                    <h2 className="text-[26px] md:text-[38px] font-black text-[#111] mb-1 tracking-tight uppercase">
                        LittleJoys on Instagram
                    </h2>
                    <p className="text-[#666] text-[13.5px] md:text-[15px] font-semibold uppercase tracking-wider">
                        Live Reels &amp; Posts directly from @{cleanHandleWithoutAt}
                    </p>
                </div>

                {/* --- Connected Account Pill & Follow CTA --- */}
                <div className="flex items-center justify-center gap-3 mb-7 sm:mb-9 flex-wrap">
                    <a
                        href={cleanProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
                    >
                        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                            <InstagramLogoIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-semibold text-slate-800">@{cleanHandleWithoutAt}</span>
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Official
                        </span>
                    </a>

                    <a
                        href={cleanProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(220,39,67,0.25)] hover:shadow-[0_8px_24px_rgba(220,39,67,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
                    >
                        <InstagramLogoIcon className="w-4 h-4" />
                        <span>Follow Us</span>
                    </a>
                </div>

                {/* --- Full Horizontal Swiper Carousel Slider --- */}
                <div className="relative w-full group/slider py-2 px-0">

                    {/* Floating Left Navigation Arrow Button (Visible ONLY on Hover) */}
                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous Instagram Slide"
                        className="absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 hover:bg-[#E51A22] hover:text-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-0 group-hover/slider:opacity-100 pointer-events-none group-hover/slider:pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                    </button>

                    {/* Floating Right Navigation Arrow Button (Visible ONLY on Hover) */}
                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next Instagram Slide"
                        className="absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 hover:bg-[#E51A22] hover:text-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-0 group-hover/slider:opacity-100 pointer-events-none group-hover/slider:pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        spaceBetween={14}
                        slidesPerView={1.4}
                        breakpoints={{
                            480: { slidesPerView: 2.2, spaceBetween: 14 },
                            768: { slidesPerView: 3.2, spaceBetween: 16 },
                            1024: { slidesPerView: 4.2, spaceBetween: 18 },
                            1280: { slidesPerView: 5.2, spaceBetween: 18 },
                            1536: { slidesPerView: 6, spaceBetween: 20 }
                        }}
                        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        loop={true}
                        className="w-full !overflow-hidden rounded-2xl sm:rounded-3xl"
                    >
                        {displayItems.map((item, idx) => (
                            <SwiperSlide key={`${item._id || 'slide'}-${idx}`} className="!h-auto flex">
                                {renderCard(item, idx)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>

            {/* --- Unique Interactive Instagram Modal Popup (Mounted via React Portal) --- */}
            {selectedItem && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/20 relative flex flex-col md:flex-row my-auto max-h-[92vh] md:max-h-[85vh] transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Gradient Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] z-20" />

                        {/* LEFT COLUMN: Media Box (Video plays with audio controls, Photo is 100% visible) */}
                        <div
                            onClick={() => window.open(selectedItem.url || cleanProfileUrl, '_blank', 'noopener,noreferrer')}
                            className="relative md:w-3/5 bg-[#0a0a0c] flex items-center justify-center p-3 sm:p-5 select-none cursor-pointer group/media overflow-hidden"
                            title="Click to open this on Instagram"
                        >
                            {selectedItem.mediaType === 'reel' && selectedItem.videoUrl ? (
                                <div className="relative flex items-center justify-center w-full h-full">
                                    <video
                                        src={selectedItem.videoUrl}
                                        poster={selectedItem.thumbnailUrl}
                                        autoPlay
                                        muted={isMuted}
                                        controls
                                        loop
                                        playsInline
                                        className="max-h-[48vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-md"
                                    />
                                    {/* Quick Mute/Unmute Toggle Overlay Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMuted(!isMuted);
                                        }}
                                        className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md"
                                        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                                    >
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            ) : (
                                <img
                                    src={selectedItem.thumbnailUrl}
                                    alt={selectedItem.caption || 'Instagram Post'}
                                    onError={(e) => {
                                        if (selectedItem.fallbackUrl && e.target.src !== selectedItem.fallbackUrl) {
                                            e.target.src = selectedItem.fallbackUrl;
                                        }
                                    }}
                                    className="max-h-[48vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover/media:scale-[1.01]"
                                />
                            )}

                            {/* Floating Tap to Open Badge */}
                            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center pointer-events-none">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold shadow-lg border border-white/20 group-hover/media:bg-gradient-to-r group-hover/media:from-[#dc2743] group-hover/media:to-[#bc1888] transition-all">
                                    <InstagramLogoIcon className="w-3.5 h-3.5" />
                                    <span>Click to View on Instagram ↗</span>
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Authentic Instagram View */}
                        <div className="md:w-2/5 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-100 overflow-hidden">
                            {/* Profile Header Bar */}
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                                <a
                                    href={cleanProfileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 group/profile cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 shadow-sm group-hover/profile:scale-105 transition-transform">
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#dc2743]">
                                            <InstagramLogoIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 group-hover/profile:text-rose-600 transition-colors flex items-center gap-1 leading-tight">
                                            <span>{cleanHandleWithoutAt}</span>
                                            <span className="w-4 h-4 rounded-full bg-[#0095F6] text-white flex items-center justify-center text-[9px] font-black" title="Verified Account">✓</span>
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                            {selectedItem.mediaType === 'reel' ? (
                                                <span className="flex items-center gap-1 text-rose-600">
                                                    <ReelsIcon className="w-3 h-3 fill-rose-600" />
                                                    <span>Instagram Reel</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500">
                                                    <PostIcon className="w-3 h-3" />
                                                    <span>Instagram Post</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </a>

                                {/* Clean Header Close Button */}
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-4 h-4 stroke-[2.5]" />
                                </button>
                            </div>

                            {/* Caption & Post Activity Details */}
                            <div className="p-5 overflow-y-auto space-y-4 flex-1">
                                {/* Instagram Interaction Icons */}
                                <div className="flex items-center justify-between text-slate-700 pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-3.5">
                                        <button
                                            type="button"
                                            onClick={() => window.open(selectedItem.url || cleanProfileUrl, '_blank')}
                                            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                            title="Like on Instagram"
                                        >
                                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open(selectedItem.url || cleanProfileUrl, '_blank')}
                                            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                            title="Comment on Instagram"
                                        >
                                            <MessageCircle className="w-5 h-5 hover:text-slate-900 transition-colors" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open(selectedItem.url || cleanProfileUrl, '_blank')}
                                            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                            title="Share on Instagram"
                                        >
                                            <Send className="w-5 h-5 hover:text-slate-900 transition-colors" />
                                        </button>
                                    </div>
                                    <Bookmark className="w-5 h-5 text-slate-400" />
                                </div>

                                {/* Likes Counter */}
                                <div className="text-xs font-black text-slate-800">
                                    {selectedItem.likes || '136'} likes
                                </div>

                                {/* Post Caption */}
                                <div className="space-y-1">
                                    <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                                        <span className="font-extrabold text-slate-900 mr-2">{cleanHandleWithoutAt}</span>
                                        {selectedItem.caption || `Moments & updates from @${cleanHandleWithoutAt} on Instagram ✨`}
                                    </p>
                                </div>

                                {/* Live Status Badge */}
                                <div className="pt-2">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Verified Instagram Feed</span>
                                    </span>
                                </div>
                            </div>

                            {/* Footer Action Button: Direct Link to Instagram */}
                            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 shrink-0 space-y-2">
                                <a
                                    href={selectedItem.url || cleanProfileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <InstagramLogoIcon className="w-4 h-4" />
                                    <span>Open on Instagram</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <p className="text-[10px] text-center text-slate-400 font-medium">
                                    Opens this post directly on @{cleanHandleWithoutAt}'s Instagram
                                </p>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            )}

        </section>
    );
};

export default InstagramFeedSection;
