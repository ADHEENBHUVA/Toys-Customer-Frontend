import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Blog = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <span className="text-[#2e4053] font-bold">Home</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">News</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Sidebar */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* Page Title */}
                    <h1 className="text-3xl font-bold text-[#2e4053] mb-6 font-serif">
                        Blog standard
                    </h1>

                    {/* Search */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full border border-slate-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-[#1282a2]"
                        />
                        <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1282a2] hover:bg-[#0f6c87] text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#2e4053] mb-6 font-serif">
                            Categories
                        </h3>
                        <ul className="space-y-4">
                            {['Education and Development', 'Toy Safety', 'Toy Trends', 'Customer Stories', 'Events and Promotions'].map(cat => (
                                <li key={cat}>
                                    <Link to="#" className="flex items-center text-sm font-medium text-slate-600 hover:text-[#1282a2] transition-colors">
                                        <Plus className="w-3 h-3 mr-2 shrink-0" strokeWidth={3} />
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recent Posts */}
                    <div className="border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#2e4053] mb-6 font-serif">
                            Recent Posts
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-[60px] h-[60px] rounded-[2rem] overflow-hidden shrink-0">
                                    <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80" alt="Recent 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-[#2e4053] leading-tight group-hover:text-[#1282a2] transition-colors line-clamp-3">Enhancing motor skills through play</h4>
                            </div>
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-[60px] h-[60px] rounded-[2rem] overflow-hidden shrink-0">
                                    <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=150&q=80" alt="Recent 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-[#2e4053] leading-tight group-hover:text-[#1282a2] transition-colors line-clamp-3">Fostering problem solving skills</h4>
                            </div>
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-[60px] h-[60px] rounded-[2rem] overflow-hidden shrink-0">
                                    <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=150&q=80" alt="Recent 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-[#2e4053] leading-tight group-hover:text-[#1282a2] transition-colors line-clamp-3">Emotional and Social Development</h4>
                            </div>
                        </div>
                    </div>

                    {/* Popular Tag */}
                    <div className="border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#2e4053] mb-6 font-serif">
                            Popular Tag
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Learn & Inspire', 'Top Toy', 'Family fun', 'Toy Reviews', 'Toy Trends', 'Tips & Tricks'].map(tag => (
                                <Link key={tag} to="#" className="text-xs font-medium text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 hover:border-[#1282a2] hover:text-[#1282a2] transition-colors">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Promotional Banner */}
                    <div className="bg-[#ffa5ba] rounded-2xl p-6 text-center relative overflow-hidden flex flex-col h-[320px]">
                        <div className="relative z-10 pt-4">
                            <h3 className="text-[22px] font-black text-[#1282a2] mb-3 leading-tight font-serif">
                                Dream Toys at <br/> Delightful Prices!
                            </h3>
                            <p className="text-[#1282a2] font-bold text-[13px] mb-6">
                                15% Off on Kids' Toys and<br/>Gifts!
                            </p>
                            <button className="bg-[#fbdf14] hover:bg-[#ebd013] text-[#2e4053] font-bold text-[14px] px-6 py-2.5 rounded-full transition-transform hover:-translate-y-1 shadow-sm mx-auto inline-block">
                                Shop now
                            </button>
                        </div>
                        {/* Stuffed Toys Image */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-center items-end opacity-90 mix-blend-multiply">
                            <img src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=400&q=80" alt="Stuffed toys" className="object-contain w-[140%] -mb-4 grayscale opacity-40 mix-blend-color-burn" />
                        </div>
                    </div>
                </div>

                {/* Right Main Content (Posts) */}
                <div className="lg:col-span-9 mt-12 lg:mt-0">
                    <div className="space-y-12">
                        
                        {/* Post 1 */}
                        <div className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-6 h-[250px] md:h-[400px]">
                                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80" alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-1.5 w-fit mb-4">
                                <Calendar className="w-3.5 h-3.5 text-[#1282a2]" />
                                <span className="text-[12px] font-medium text-slate-500">March 24, 2024</span>
                            </div>
                            <h2 className="text-[22px] font-bold text-[#2e4053] mb-3 group-hover:text-[#1282a2] transition-colors font-serif">
                                Enhancing motor skills through play
                            </h2>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-4xl">
                                Motor skills are divided into two categories: fine motor skills and gross motor skills. Toys play a vital role in the development of both...
                            </p>
                        </div>

                        {/* Post 2 */}
                        <div className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-6 h-[250px] md:h-[400px]">
                                <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80" alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-1.5 w-fit mb-4">
                                <Calendar className="w-3.5 h-3.5 text-[#1282a2]" />
                                <span className="text-[12px] font-medium text-slate-500">Feb 12, 2024</span>
                            </div>
                            <h2 className="text-[22px] font-bold text-[#2e4053] mb-3 group-hover:text-[#1282a2] transition-colors font-serif">
                                Fostering problem solving skills
                            </h2>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-4xl">
                                Problem-solving is a critical skill that children begin to develop from a very young age through interactive and engaging play. Toys that challenge children to think out strategies encourage this development...
                            </p>
                        </div>

                        {/* Post 3 */}
                        <div className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-6 h-[250px] md:h-[400px]">
                                <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80" alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-1.5 w-fit mb-4">
                                <Calendar className="w-3.5 h-3.5 text-[#1282a2]" />
                                <span className="text-[12px] font-medium text-slate-500">Jun 10, 2023</span>
                            </div>
                            <h2 className="text-[22px] font-bold text-[#2e4053] mb-3 group-hover:text-[#1282a2] transition-colors font-serif">
                                Emotional and Social Development
                            </h2>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-4xl">
                                Toys also help children express their emotions and understand those of others, which is foundational for developing empathy and interpersonal skills...
                            </p>
                        </div>
                        
                        {/* Post 4 */}
                        <div className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-6 h-[250px] md:h-[400px]">
                                <img src="https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=1200&q=80" alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-1.5 w-fit mb-4">
                                <Calendar className="w-3.5 h-3.5 text-[#1282a2]" />
                                <span className="text-[12px] font-medium text-slate-500">September 14, 2023</span>
                            </div>
                            <h2 className="text-[22px] font-bold text-[#2e4053] mb-3 group-hover:text-[#1282a2] transition-colors font-serif">
                                Language Development and Social Skills
                            </h2>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-4xl">
                                Language development is significantly influenced by interactive play. Toys that involve multiple participants can help develop this skill, as well as social skills...
                            </p>
                        </div>

                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-16 pb-8">
                        <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#1282a2] hover:text-[#1282a2] transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-[#1282a2] text-white font-bold text-sm flex items-center justify-center">
                            1
                        </button>
                        <button className="w-9 h-9 rounded-full border border-slate-200 text-[#2e4053] font-bold text-sm flex items-center justify-center hover:border-[#1282a2] hover:text-[#1282a2] transition-colors">
                            2
                        </button>
                        <button className="w-9 h-9 rounded-full border border-slate-200 text-[#2e4053] font-bold text-sm flex items-center justify-center hover:border-[#1282a2] hover:text-[#1282a2] transition-colors">
                            3
                        </button>
                        <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#1282a2] hover:text-[#1282a2] transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Blog;
