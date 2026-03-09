package lk.suraksha.lms;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Force the WebView to always revalidate cached resources using HTTP headers.
        // This ensures that when lms.suraksha.lk is updated, the app picks up changes
        // on next open without needing a Play Store update.
        // - index.html (no-cache on S3) will always be re-fetched → new bundle hashes load.
        // - Hashed JS/CSS (immutable on S3) stay cached → zero re-download if unchanged.
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebSettings settings = getBridge().getWebView().getSettings();
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Clear expired cache entries when app comes to foreground.
        // Passing false keeps valid cached resources (hashed bundles),
        // but forces revalidation of no-cache resources (index.html).
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().clearCache(false);
        }
    }
}
