window.NTE = window.NTE || {};
window.NTE.components = window.NTE.components || {};

window.NTE.components.Navbar = {
  template: /* html */ `
    <div class="navbar bg-base-100 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex-1">
          <a href="./index.html" class="btn btn-ghost text-xl">
            <span class="text-primary">異環 NTE</span>
            <span class="hidden sm:inline text-base-content/70 text-sm font-normal">素材計算器</span>
          </a>
        </div>
        <div class="flex-none flex items-center gap-1">
          <a href="https://github.com/hankz1108" target="_blank" rel="noopener" class="btn btn-ghost btn-circle" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.57-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
};
