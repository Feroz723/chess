import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for debugging purposes in development/staging
    console.error('[Sanctum Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem('wizards_react_user_v1');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09080d] text-[#f8fafc] p-6 select-none font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#14101e]/95 border border-amber-400/40 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              ♔
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-200 mb-2">
                Sanctum Reconnection
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                The 3D graphics canvas encountered a display reset. Click below to restore the arena.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-black font-extrabold text-sm uppercase tracking-wider shadow-xl transition cursor-pointer"
              >
                Restore 3D Arena
              </button>
            </div>

            <button
              type="button"
              onClick={this.handleResetState}
              className="text-[11px] text-slate-400 hover:text-amber-200 underline underline-offset-2 transition cursor-pointer"
            >
              Reset Session &amp; Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
