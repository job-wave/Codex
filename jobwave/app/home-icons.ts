// Decorative line icons shared by the home roadmaps and service list.
const paths={
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 12a21 21 0 0 0 18 0m-9 1v3"/>',
 checkFile:'<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Zm0 0v7h7m-12 5 2 2 4-4"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
 notebook:'<rect x="6" y="3" width="14" height="18" rx="2"/><path d="M3 7h5m-5 5h5m-5 5h5m3-9h5m-5 4h5m-5 4h3"/>',
 compare:'<path d="M5 4v16m14-16v16M8 8h8l-2-2m2 10H8l2 2"/>',
 flag:'<path d="M5 21V4m0 1c5-4 9 3 14-1v10c-5 4-9-3-14 1"/>',
 jobs:'<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Zm0 0v7h7M8 14h8m-8 3h5"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m3 0h1m-11 3h2m3 0h2"/>',
 wallet:'<path d="M19 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6m18 6h-5a2 2 0 0 0 0 4h5"/>',
 education:'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v5c3 3 9 3 12 0v-5m4-2v6"/>',
 mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1m-7 8v3m-4 0h8"/>',
 insights:'<path d="M4 4v16h16M8 15l4-4 3 2 5-6m-4 0h4v4"/>',
};
export type HomeIcon=keyof typeof paths;
export function homeIcon(name:HomeIcon){
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}
