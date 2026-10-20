const DEVTOOLS_DATA = {
  tools: [
    {
      id: "list_pages",
      name: "list_pages",
      category: "Navigation & Lifecycle",
      readOnly: true,
      description: "Enumerates all available browser pages, tabs, and targets with unique identifiers, titles, and active URLs.",
      params: [],
      example: "{\n  \"tool\": \"list_pages\"\n}",
      returns: "{\n  \"pages\": [\n    {\n      \"id\": \"PAGE_TARGET_01\",\n      \"title\": \"Dashboard Overview\",\n      \"url\": \"https://app.internal/dashboard\",\n      \"selected\": true\n    }\n  ]\n}"
    },
    {
      id: "new_page",
      name: "new_page",
      category: "Navigation & Lifecycle",
      readOnly: false,
      description: "Opens a brand-new browser tab, optionally loading an initial URL immediately.",
      params: [
        { name: "url", type: "string", required: false, description: "Initial URL to load inside the newly created page." }
      ],
      example: "{\n  \"url\": \"https://app.internal/staging\"\n}",
      returns: "{\n  \"pageId\": \"PAGE_TARGET_02\",\n  \"status\": \"created\"\n}"
    },
    {
      id: "select_page",
      name: "select_page",
      category: "Navigation & Lifecycle",
      readOnly: false,
      description: "Switches the active operational focus of the DevTools session to a targeted page ID.",
      params: [
        { name: "pageId", type: "string", required: true, description: "Unique target identifier of the page to focus." }
      ],
      example: "{\n  \"pageId\": \"PAGE_TARGET_02\"\n}",
      returns: "{\n  \"success\": true,\n  \"activePageId\": \"PAGE_TARGET_02\"\n}"
    },
    {
      id: "close_page",
      name: "close_page",
      category: "Navigation & Lifecycle",
      readOnly: false,
      description: "Terminates and closes a targeted browser page tab.",
      params: [
        { name: "pageId", type: "string", required: true, description: "Target identifier of the page to close." }
      ],
      example: "{\n  \"pageId\": \"PAGE_TARGET_02\"\n}",
      returns: "{\n  \"success\": true\n}"
    },
    {
      id: "navigate_page",
      name: "navigate_page",
      category: "Navigation & Lifecycle",
      readOnly: false,
      description: "Navigates the currently active page to a target URL or along history navigation vectors.",
      params: [
        { name: "url", type: "string", required: true, description: "Destination web address or relative URI." },
        { name: "type", type: "string", required: false, description: "Navigation mode: 'url', 'back', 'forward', or 'reload'." }
      ],
      example: "{\n  \"url\": \"https://app.internal/settings\",\n  \"type\": \"url\"\n}",
      returns: "{\n  \"url\": \"https://app.internal/settings\",\n  \"httpStatus\": 200,\n  \"navigationId\": \"NAV_98124\"\n}"
    },
    {
      id: "wait_for",
      name: "wait_for",
      category: "Interaction & Input",
      readOnly: true,
      description: "Blocks execution until a specified element selector, UID, text fragment, or page state is resolved.",
      params: [
        { name: "selector", type: "string", required: false, description: "CSS or XPath selector string to await." },
        { name: "text", type: "string", required: false, description: "Expected textual string within the DOM tree." },
        { name: "timeoutMs", type: "number", required: false, description: "Maximum wait duration in milliseconds before timing out." }
      ],
      example: "{\n  \"selector\": \"#payment-form-submit\",\n  \"timeoutMs\": 5000\n}",
      returns: "{\n  \"found\": true,\n  \"durationMs\": 412\n}"
    },
    {
      id: "take_snapshot",
      name: "take_snapshot",
      category: "DOM & Accessibility",
      readOnly: true,
      description: "Captures the semantic Accessibility Tree (AXTree) with stable element UIDs for robust automation.",
      params: [
        { name: "filePath", type: "string", required: false, description: "Local disk path to stream large snapshot payloads." },
        { name: "verbose", type: "boolean", required: false, description: "Include detailed ARIA properties and bounding boxes." }
      ],
      example: "{\n  \"verbose\": true\n}",
      returns: "{\n  \"root\": {\n    \"role\": \"RootWebArea\",\n    \"name\": \"Checkout\",\n    \"children\": [\n      {\n        \"uid\": \"elem_104\",\n        \"role\": \"button\",\n        \"name\": \"Confirm Order\"\n      }\n    ]\n  }\n}"
    },
    {
      id: "take_screenshot",
      name: "take_screenshot",
      category: "DOM & Accessibility",
      readOnly: true,
      description: "Renders an exact visual bitmap of the entire viewport, full document, or specific element UID.",
      params: [
        { name: "filePath", type: "string", required: false, description: "File path on disk to write the PNG/JPEG capture." },
        { name: "fullPage", type: "boolean", required: false, description: "When true, captures the entire scrollable document." },
        { name: "uid", type: "string", required: false, description: "Element UID to constrain screenshot to bounding box." }
      ],
      example: "{\n  \"filePath\": \"C:/Users/lenovo/Desktop/evidence.png\",\n  \"fullPage\": true\n}",
      returns: "{\n  \"savedTo\": \"C:/Users/lenovo/Desktop/evidence.png\",\n  \"width\": 1920,\n  \"height\": 1080,\n  \"bytes\": 241908\n}"
    },
    {
      id: "click",
      name: "click",
      category: "Interaction & Input",
      readOnly: false,
      description: "Simulates native mouse click dispatch on target element UID resolved from accessibility snapshot.",
      params: [
        { name: "uid", type: "string", required: true, description: "Element UID identifier from snapshot." },
        { name: "includeSnapshot", type: "boolean", required: false, description: "Return updated AXTree snapshot in the response." }
      ],
      example: "{\n  \"uid\": \"elem_104\",\n  \"includeSnapshot\": false\n}",
      returns: "{\n  \"clicked\": true,\n  \"uid\": \"elem_104\"\n}"
    },
    {
      id: "fill",
      name: "fill",
      category: "Interaction & Input",
      readOnly: false,
      description: "Clears and populates form input elements with specified textual value.",
      params: [
        { name: "uid", type: "string", required: true, description: "Form control UID from accessibility snapshot." },
        { name: "value", type: "string", required: true, description: "Input text payload to set." }
      ],
      example: "{\n  \"uid\": \"elem_82\",\n  \"value\": \"alex.dev@corp.internal\"\n}",
      returns: "{\n  \"filled\": true,\n  \"uid\": \"elem_82\",\n  \"charCount\": 22\n}"
    },
    {
      id: "hover",
      name: "hover",
      category: "Interaction & Input",
      readOnly: false,
      description: "Directs pointer cursor over target element UID to trigger flyout menus, tooltips, or hover states.",
      params: [
        { name: "uid", type: "string", required: true, description: "Element UID identifier to hover over." }
      ],
      example: "{\n  \"uid\": \"elem_55\"\n}",
      returns: "{\n  \"hovered\": true\n}"
    },
    {
      id: "press_key",
      name: "press_key",
      category: "Interaction & Input",
      readOnly: false,
      description: "Dispatches native keyboard events such as Tab, Enter, Escape, ArrowDown, or combination keys.",
      params: [
        { name: "key", type: "string", required: true, description: "Key identifier string ('Tab', 'Enter', 'Escape', etc.)." }
      ],
      example: "{\n  \"key\": \"Tab\"\n}",
      returns: "{\n  \"dispatched\": true,\n  \"activeElementUid\": \"elem_83\"\n}"
    },
    {
      id: "evaluate_script",
      name: "evaluate_script",
      category: "Inspection & Auditing",
      readOnly: false,
      description: "Executes arbitrary JavaScript snippet in page runtime context and returns serialized JSON output.",
      params: [
        { name: "script", type: "string", required: true, description: "JavaScript function or expression string to execute." },
        { name: "args", type: "array", required: false, description: "Optional arguments to pass into the script function." }
      ],
      example: "{\n  \"script\": \"() => window.__APP_VERSION__\"\n}",
      returns: "{\n  \"result\": \"v3.14.0-production\"\n}"
    },
    {
      id: "list_console_messages",
      name: "list_console_messages",
      category: "Inspection & Auditing",
      readOnly: true,
      description: "Retrieves console logs, uncaught exceptions, network warnings, and native browser audit issues.",
      params: [
        { name: "types", type: "array", required: false, description: "Filter message categories: ['issue', 'error', 'warning', 'info']." },
        { name: "includePreservedMessages", type: "boolean", required: false, description: "Include logs preserved across navigation reloads." }
      ],
      example: "{\n  \"types\": [\"issue\", \"error\"],\n  \"includePreservedMessages\": true\n}",
      returns: "{\n  \"messages\": [\n    {\n      \"id\": \"LOG_1\",\n      \"type\": \"issue\",\n      \"subType\": \"LowContrast\",\n      \"text\": \"Insufficient contrast ratio 2.8:1 on #sub-btn\"\n    }\n  ]\n}"
    },
    {
      id: "get_console_message",
      name: "get_console_message",
      category: "Inspection & Auditing",
      readOnly: true,
      description: "Inspects full stack trace, origin script, line number, and serialized objects for a specific log ID.",
      params: [
        { name: "messageId", type: "string", required: true, description: "Identifier of the console message to inspect." }
      ],
      example: "{\n  \"messageId\": \"LOG_1\"\n}",
      returns: "{\n  \"messageId\": \"LOG_1\",\n  \"stack\": \"Error at checkout.js:142:18\",\n  \"sourceUrl\": \"https://app.internal/checkout.js\",\n  \"lineNumber\": 142\n}"
    },
    {
      id: "list_network_requests",
      name: "list_network_requests",
      category: "Network & Traffic",
      readOnly: true,
      description: "Queries HTTP/HTTPS network transaction history with filtering by resource type and status codes.",
      params: [
        { name: "resourceTypes", type: "array", required: false, description: "Filter categories: ['Document', 'Image', 'Font', 'Script', 'XHR', 'Fetch']." },
        { name: "pageSize", type: "number", required: false, description: "Maximum entries to retrieve per page." }
      ],
      example: "{\n  \"resourceTypes\": [\"Image\", \"Font\"]\n}",
      returns: "{\n  \"requests\": [\n    {\n      \"requestId\": \"REQ_441\",\n      \"url\": \"https://app.internal/hero.webp\",\n      \"type\": \"Image\",\n      \"status\": 200,\n      \"durationMs\": 182\n    }\n  ]\n}"
    },
    {
      id: "get_network_request",
      name: "get_network_request",
      category: "Network & Traffic",
      readOnly: true,
      description: "Returns detailed timing waterfalls, request headers, response headers, payload, and body content.",
      params: [
        { name: "requestId", type: "string", required: true, description: "Unique network transaction ID." }
      ],
      example: "{\n  \"requestId\": \"REQ_441\"\n}",
      returns: "{\n  \"requestId\": \"REQ_441\",\n  \"url\": \"https://app.internal/hero.webp\",\n  \"timing\": {\n    \"dns\": 12,\n    \"connect\": 24,\n    \"ttfb\": 80,\n    \"download\": 66\n  },\n  \"responseHeaders\": {\n    \"content-type\": \"image/webp\",\n    \"cache-control\": \"public, max-age=31536000\"\n  }\n}"
    },
    {
      id: "performance_start_trace",
      name: "performance_start_trace",
      category: "Performance & Vitals",
      readOnly: false,
      description: "Starts Chrome DevTools performance profiling trace, capturing CPU slices, rendering timelines, and LCP milestones.",
      params: [
        { name: "reload", type: "boolean", required: false, description: "Automatically reloads page to capture cold boot metrics." },
        { name: "autoStop", type: "boolean", required: false, description: "Automatically halts profiling after page settle." }
      ],
      example: "{\n  \"reload\": true,\n  \"autoStop\": true\n}",
      returns: "{\n  \"traceId\": \"TRACE_BOOT_881\",\n  \"lcpTimeMs\": 2140,\n  \"insightSetIds\": [\"INSIGHT_SET_01\"]\n}"
    },
    {
      id: "performance_stop_trace",
      name: "performance_stop_trace",
      category: "Performance & Vitals",
      readOnly: false,
      description: "Manually halts an active performance profiling trace and formats captured timeline data.",
      params: [],
      example: "{\n  \"tool\": \"performance_stop_trace\"\n}",
      returns: "{\n  \"status\": \"completed\",\n  \"durationMs\": 8420\n}"
    },
    {
      id: "performance_analyze_insight",
      name: "performance_analyze_insight",
      category: "Performance & Vitals",
      readOnly: true,
      description: "Extracts structured performance insights such as LCPBreakdown, DocumentLatency, RenderBlocking, and LCPDiscovery.",
      params: [
        { name: "insightSetId", type: "string", required: true, description: "Insight collection identifier from performance trace." },
        { name: "insightName", type: "string", required: true, description: "Target metric: 'LCPBreakdown', 'DocumentLatency', 'RenderBlocking', 'LCPDiscovery'." }
      ],
      example: "{\n  \"insightSetId\": \"INSIGHT_SET_01\",\n  \"insightName\": \"LCPBreakdown\"\n}",
      returns: "{\n  \"ttfbMs\": 420,\n  \"resourceLoadDelayMs\": 90,\n  \"resourceLoadDurationMs\": 780,\n  \"elementRenderDelayMs\": 850,\n  \"totalLcpMs\": 2140\n}"
    },
    {
      id: "lighthouse_audit",
      name: "lighthouse_audit",
      category: "Performance & Vitals",
      readOnly: true,
      description: "Executes automated Google Lighthouse audit across Performance, Accessibility, Best Practices, and SEO.",
      params: [
        { name: "mode", type: "string", required: false, description: "Audit mode: 'navigation', 'timespan', or 'snapshot'." },
        { name: "outputDirPath", type: "string", required: false, description: "Directory to save raw Lighthouse JSON report file." }
      ],
      example: "{\n  \"mode\": \"navigation\",\n  \"outputDirPath\": \"C:/Users/lenovo/Desktop/lh_report\"\n}",
      returns: "{\n  \"scores\": {\n    \"performance\": 0.94,\n    \"accessibility\": 0.88,\n    \"bestPractices\": 1.0,\n    \"seo\": 0.98\n  },\n  \"failedAuditsCount\": 3\n}"
    },
    {
      id: "take_memory_snapshot",
      name: "take_memory_snapshot",
      category: "Memory & Heaps",
      readOnly: true,
      description: "Captures full V8 JavaScript heap snapshot directly to disk for leak analysis using Memlab or fallback script.",
      params: [
        { name: "filePath", type: "string", required: true, description: "Target file system path (.heapsnapshot) to save memory dump." }
      ],
      example: "{\n  \"filePath\": \"C:/Users/lenovo/Desktop/baseline.heapsnapshot\"\n}",
      returns: "{\n  \"savedTo\": \"C:/Users/lenovo/Desktop/baseline.heapsnapshot\",\n  \"bytesWritten\": 48192031\n}"
    },
    {
      id: "emulate",
      name: "emulate",
      category: "Emulation & Environment",
      readOnly: false,
      description: "Configures responsive viewport dimensions, device scale factors, CPU throttling rates, and network profiles.",
      params: [
        { name: "networkConditions", type: "string", required: false, description: "Preset profile: 'Fast 3G', 'Slow 3G', 'Offline'." },
        { name: "cpuThrottlingRate", type: "number", required: false, description: "CPU slowdown factor (e.g., 4 for 4x slowdown)." },
        { name: "viewport", type: "object", required: false, description: "Dimensions: { width: 375, height: 812, deviceScaleFactor: 3, isMobile: true }." }
      ],
      example: "{\n  \"networkConditions\": \"Fast 3G\",\n  \"cpuThrottlingRate\": 4\n}",
      returns: "{\n  \"networkEmulated\": \"Fast 3G\",\n  \"cpuSlowdown\": 4\n}"
    }
  ],

  snippets: [
    {
      id: "a11y_orphaned_inputs",
      category: "Accessibility",
      title: "Find Orphaned Form Inputs",
      description: "Identifies inputs, selects, and textareas missing an explicit label, aria-label, aria-labelledby, or wrapping label element.",
      code: "() => {\n  return Array.from(document.querySelectorAll('input, select, textarea'))\n    .filter(el => {\n      const hasId = el.id && document.querySelector('label[for=\"' + el.id + '\"]');\n      const hasAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');\n      const hasWrapper = el.closest('label');\n      return !hasId && !hasAria && !hasWrapper;\n    })\n    .map(el => ({\n      tag: el.tagName,\n      id: el.id || null,\n      name: el.name || null,\n      placeholder: el.placeholder || null,\n      type: el.type || null\n    }));\n}",
      sampleOutput: "[\n  {\n    \"tag\": \"INPUT\",\n    \"id\": null,\n    \"name\": \"coupon_code\",\n    \"placeholder\": \"Enter code\",\n    \"type\": \"text\"\n  }\n]"
    },
    {
      id: "a11y_tap_targets",
      category: "Accessibility",
      title: "Measure Tap Target Bounding Box",
      description: "Measures element client bounding rect dimensions against the WCAG AA minimum 48px by 48px standard.",
      code: "el => {\n  const rect = el.getBoundingClientRect();\n  const isCompliant = rect.width >= 48 && rect.height >= 48;\n  return {\n    width: Math.round(rect.width),\n    height: Math.round(rect.height),\n    compliant: isCompliant,\n    shortfallW: Math.max(0, 48 - Math.round(rect.width)),\n    shortfallH: Math.max(0, 48 - Math.round(rect.height))\n  };\n}",
      sampleOutput: "{\n  \"width\": 32,\n  \"height\": 32,\n  \"compliant\": false,\n  \"shortfallW\": 16,\n  \"shortfallH\": 16\n}"
    },
    {
      id: "a11y_contrast",
      category: "Accessibility",
      title: "Evaluate Color Contrast Luminance Ratio",
      description: "Computes WCAG AA luminance contrast ratio between foreground text and background color (4.5:1 for regular text, 3.0:1 for large text).",
      code: "el => {\n  function getRGB(colorStr) {\n    const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);\n    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [255, 255, 255];\n  }\n  function luminance(r, g, b) {\n    const a = [r, g, b].map(v => {\n      v /= 255;\n      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);\n    });\n    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;\n  }\n  const style = window.getComputedStyle(el);\n  const fg = getRGB(style.color);\n  const bg = getRGB(style.backgroundColor);\n  const l1 = luminance(fg[0], fg[1], fg[2]);\n  const l2 = luminance(bg[0], bg[1], bg[2]);\n  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);\n  return {\n    color: style.color,\n    backgroundColor: style.backgroundColor,\n    contrastRatio: ratio.toFixed(2),\n    passesNormalText: ratio >= 4.5,\n    passesLargeText: ratio >= 3.0\n  };\n}",
      sampleOutput: "{\n  \"color\": \"rgb(156, 163, 175)\",\n  \"backgroundColor\": \"rgb(255, 255, 255)\",\n  \"contrastRatio\": \"2.82\",\n  \"passesNormalText\": false,\n  \"passesLargeText\": false\n}"
    },
    {
      id: "a11y_global_checks",
      category: "Accessibility",
      title: "Document-Level Global Accessibility Audit",
      description: "Validates html lang attribute, title presence, viewport zooming configuration, and prefers-reduced-motion media query status.",
      code: "() => ({\n  lang: document.documentElement.lang || 'MISSING - Screen readers fail language detection',\n  title: document.title || 'MISSING - Missing page contextual heading',\n  viewport: document.querySelector('meta[name=\"viewport\"]')?.content || 'MISSING - Missing mobile responsive viewport',\n  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Enabled' : 'Disabled'\n})",
      sampleOutput: "{\n  \"lang\": \"en\",\n  \"title\": \"Enterprise Payment Portal\",\n  \"viewport\": \"width=device-width, initial-scale=1.0\",\n  \"reducedMotion\": \"Disabled\"\n}"
    },
    {
      id: "lcp_identify_element",
      category: "Performance",
      title: "Identify Largest Contentful Paint Element",
      description: "Uses browser PerformanceObserver API to extract exact LCP candidate node, element tag, resource URL, load timing, and render time.",
      code: "() => new Promise(resolve => {\n  new PerformanceObserver((entryList, observer) => {\n    const entries = entryList.getEntries();\n    const lastEntry = entries[entries.length - 1];\n    observer.disconnect();\n    resolve({\n      tag: lastEntry.element?.tagName || null,\n      id: lastEntry.element?.id || null,\n      className: lastEntry.element?.className || null,\n      url: lastEntry.url || '',\n      renderTime: Math.round(lastEntry.renderTime || lastEntry.loadTime),\n      loadTime: Math.round(lastEntry.loadTime),\n      size: lastEntry.size\n    });\n  }).observe({ type: 'largest-contentful-paint', buffered: true });\n})",
      sampleOutput: "{\n  \"tag\": \"IMG\",\n  \"id\": \"hero-banner\",\n  \"className\": \"w-full h-auto object-cover\",\n  \"url\": \"https://app.internal/assets/hero-banner.webp\",\n  \"renderTime\": 2140,\n  \"loadTime\": 1920,\n  \"size\": 428010\n}"
    },
    {
      id: "lcp_audit_issues",
      category: "Performance",
      title: "Audit Common LCP Anti-Patterns in Viewport",
      description: "Inspects initial viewport images for lazy-loading misconfigurations, missing fetchpriority=high attributes, and render-blocking head scripts.",
      code: "() => {\n  const viewportHeight = window.innerHeight;\n  const viewportImages = Array.from(document.querySelectorAll('img')).filter(img => {\n    const rect = img.getBoundingClientRect();\n    return rect.top >= 0 && rect.top <= viewportHeight;\n  });\n  const lazyLoadedInViewport = viewportImages.filter(img => img.getAttribute('loading') === 'lazy').map(img => img.src);\n  const missingFetchPriority = viewportImages.filter(img => img.getAttribute('fetchpriority') !== 'high').map(img => img.src);\n  const renderBlockingScripts = Array.from(document.querySelectorAll('head > script:not([async]):not([defer]):not([type=\"module\"])')).map(s => s.src || 'inline');\n  return {\n    viewportImagesCount: viewportImages.length,\n    lazyLoadedInViewport: lazyLoadedInViewport,\n    missingFetchPriority: missingFetchPriority,\n    renderBlockingScriptsCount: renderBlockingScripts.length,\n    renderBlockingScripts: renderBlockingScripts\n  };\n}",
      sampleOutput: "{\n  \"viewportImagesCount\": 2,\n  \"lazyLoadedInViewport\": [\"https://app.internal/assets/hero-banner.webp\"],\n  \"missingFetchPriority\": [\"https://app.internal/assets/hero-banner.webp\"],\n  \"renderBlockingScriptsCount\": 1,\n  \"renderBlockingScripts\": [\"https://app.internal/vendor/bundle.js\"]\n}"
    },
    {
      id: "memlab_scenario",
      category: "Memory",
      title: "Memlab Automated Leak Scenario Definition",
      description: "Memlab scenario definition module specifying url, user action, and backward navigation to detect detached DOM nodes and closure leaks.",
      code: "module.exports = {\n  url: () => 'https://app.internal/checkout',\n  action: async page => {\n    await page.click('#add-discount-btn');\n    await page.type('#discount-input', 'DISCOUNT2026');\n    await page.click('#apply-btn');\n    await page.waitForSelector('.discount-tag');\n  },\n  back: async page => {\n    await page.click('#remove-discount-btn');\n    await page.waitForSelector('.discount-removed');\n  },\n  repeat: 10,\n  leakFilter: (node, snapshot) => node.retainedSize > 100000\n};",
      sampleOutput: "memlab run --scenario=scenario.js\n[Found 1 leak trace]\nDetached HTMLDivElement (Retained: 2.4 MB)\n  -> Closure (in EventListener 'onClick')\n  -> window.__DISCOUNT_CACHE__"
    },
    {
      id: "heap_comparator",
      category: "Memory",
      title: "Fallback Heap Snapshot Comparison Script",
      description: "Node.js fallback script that processes two .heapsnapshot JSON structures to compute node delta and top retained growth without loading entire file into context.",
      code: "const fs = require('fs');\nfunction compareSnapshots(basePath, targetPath) {\n  const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));\n  const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));\n  const baseCount = base.nodes.length / base.snapshot.meta.node_fields.length;\n  const targetCount = target.nodes.length / target.snapshot.meta.node_fields.length;\n  return {\n    baseNodeCount: baseCount,\n    targetNodeCount: targetCount,\n    growthDelta: targetCount - baseCount,\n    suspectedLeak: (targetCount - baseCount) > 5000\n  };\n}\nconsole.log(JSON.stringify(compareSnapshots(process.argv[2], process.argv[3]), null, 2));",
      sampleOutput: "{\n  \"baseNodeCount\": 34102,\n  \"targetNodeCount\": 48920,\n  \"growthDelta\": 14818,\n  \"suspectedLeak\": true\n}"
    }
  ],

  troubleshooting: [
    {
      id: "devtools_active_port",
      title: "Could not find DevToolsActivePort",
      category: "Connection & Launch",
      severity: "Critical",
      cause: "MCP server with --autoConnect flag cannot locate the ephemeral port mapping file generated by an actively running debuggable Chrome instance.",
      diagnosticSteps: [
        "Check whether Google Chrome or Chrome Canary is currently running on the system.",
        "Instruct user: Open a new tab in Chrome, navigate to chrome://inspect/#remote-debugging, and ensure 'Enable remote debugging' is checked.",
        "Call list_pages tool immediately to verify whether the connection handshake succeeds.",
        "If list_pages fails again, switch MCP launcher configuration to --browser-url=http://127.0.0.1:9222."
      ],
      solutionConfig: "{\n  \"mcpServers\": {\n    \"chrome-devtools\": {\n      \"command\": \"npx\",\n      \"args\": [\"chrome-devtools-mcp@latest\", \"--browser-url=http://127.0.0.1:9222\", \"--logFile=C:/tmp/cdm.log\"]\n    }\n  }\n}"
    },
    {
      id: "readonly_mode",
      title: "Only 9 Tools Available (Read-Only Mode Lock)",
      category: "Permissions & Configuration",
      severity: "Warning",
      cause: "MCP Client enforces strict read-only execution policy. Tools annotated with readOnlyHint: false (such as click, fill, navigate_page, emulate) are suppressed.",
      diagnosticSteps: [
        "Inspect MCP tool roster. If only list_pages, take_snapshot, get_console_message, lighthouse_audit are present, read-only mode is active.",
        "Determine if client is in Planning Mode or Sandbox Safe Mode which denies mutating actions.",
        "Update client settings or exit Plan Mode in the agent session to restore mutating tool calls."
      ],
      solutionConfig: "{\n  \"toolExecutionPolicy\": \"always-proceed\",\n  \"allowMutatingBrowserTools\": true\n}"
    },
    {
      id: "flag_typo",
      title: "Server Starts but Spawns Fresh Empty Profile",
      category: "Configuration",
      severity: "Medium",
      cause: "Typo in command line arguments (such as --autoBronnect instead of --autoConnect), causing fallback to default ephemeral profile launch.",
      diagnosticSteps: [
        "Open .mcp.json or agent settings file.",
        "Audit exact argument spellings: verify --autoConnect, --browser-url, --logFile.",
        "Re-run npx chrome-devtools-mcp@latest --help to validate accepted CLI flags."
      ],
      solutionConfig: "{\n  \"command\": \"npx\",\n  \"args\": [\"chrome-devtools-mcp@latest\", \"--autoConnect\"]\n}"
    },
    {
      id: "sandbox_wsl_timeout",
      title: "Socket Closed Unexpectedly / Host Sandbox Restrictions",
      category: "Environment & Network",
      severity: "High",
      cause: "Operating system sandboxing (macOS Seatbelt, Linux Docker containers, WSL2 virtual adapters) blocking loopback WebSocket IPC.",
      diagnosticSteps: [
        "Increase startup_timeout_ms parameter to 20000ms in host configuration.",
        "In WSL2 or Docker, ensure Chrome binds to 0.0.0.0 or pass host IP bridge address.",
        "Run diagnostic command DEBUG=* npx chrome-devtools-mcp@latest --logFile=/tmp/cdm-test.log to inspect raw protocol exchange."
      ],
      solutionConfig: "{\n  \"command\": \"npx\",\n  \"args\": [\"chrome-devtools-mcp@latest\", \"--browser-url=http://host.docker.internal:9222\"],\n  \"startup_timeout_ms\": 20000\n}"
    }
  ],

  simulationStages: [
    {
      stage: "01",
      name: "Goal Conception & Autonomous Protocol (/goal)",
      actor: "Master Agent Loop",
      description: "User submits an unattended, long-running directive. Agent activates overnight thoroughness mode, continuous self-auditing, and prepares completion tokens.",
      detail: "The agent does not stop at early superficial results. It sets up persistent scratchpads, configures error tolerance, and binds the termination condition to the mandatory completion token.",
      actionCode: "PROMPT: /goal /plan Automate accessibility and performance audit on checkout portal, patch all violations, and verify zero regressions."
    },
    {
      stage: "02",
      name: "Architectural Planning & Artifact Generation (/plan)",
      actor: "Strategic Planning Engine",
      description: "Agent creates formal implementation_plan.md artifact with Goal Description, User Review Required, Open Questions, Proposed Changes, and Verification Plan.",
      detail: "Code modifications remain strictly blocked until plan approval. The plan defines automated test commands, manual reproduction steps, and maps component dependencies.",
      actionCode: "ARTIFACT_WRITE: implementation_plan.md\nMETADATA: { RequestFeedback: true, UserFacing: true }\nSTATUS: Awaiting review gate approval."
    },
    {
      stage: "03",
      name: "User Approval Gate & Transition to Execution",
      actor: "Review Gate Modal",
      description: "Plan is approved. Agent transitions from passive planning to multi-step collaborative execution without losing conversational context.",
      detail: "Tool execution policy unlocks modifying tools. Agent begins sequential component deployment, ordering foundational infrastructure before dependent layers.",
      actionCode: "USER_APPROVAL: ACCEPTED\nEXECUTION_POLICY: ACTIVE"
    },
    {
      stage: "04",
      name: "Browser Subagent Delegation (/browser)",
      actor: "invoke_subagent",
      description: "Parent agent delegates browser operations to a dedicated browser subagent with isolated context and persistent user profile.",
      detail: "Parent agent enters reactive sleep. Subagent initializes headless Chrome instance with persistent profile (~/.gemini/antigravity-browser-profile) and loads domain allowlist.",
      actionCode: "invoke_subagent({\n  TypeName: 'browser',\n  Role: 'Browser Automated Auditor',\n  Prompt: 'Inspect checkout page, execute A11y & LCP diagnostics, report raw metrics.'\n})"
    },
    {
      stage: "05",
      name: "Chrome DevTools MCP Execution (/chrome-devtools)",
      actor: "Browser Subagent + CDP",
      description: "Subagent invokes navigate_page, take_snapshot, evaluate_script, performance_start_trace, and lighthouse_audit.",
      detail: "Uses Accessibility Tree with element UIDs to locate interactive elements. Runs LCP PerformanceObserver snippet, extracts TTFB and render delays, and runs color contrast evaluation.",
      actionCode: "1. navigate_page('https://app.internal/checkout')\n2. take_snapshot() -> returns UID elem_104\n3. evaluate_script(LCP_IDENTIFY_SNIPPET)\n4. performance_start_trace({ reload: true })"
    },
    {
      stage: "06",
      name: "Diagnostic Analysis & Code Remediation",
      actor: "Main Agent Workspace",
      description: "Subagent reports findings. Main agent parses failures: missing labels, LCP hero image lazy-loaded, contrast ratio 2.8:1.",
      detail: "Main agent modifies checkout components: removes loading='lazy', adds fetchpriority='high', inlines critical CSS, fixes input label associations, and updates contrast hex codes.",
      actionCode: "REPLACE_FILE_CONTENT:\n- <img src='hero.webp' loading='lazy'>\n+ <img src='hero.webp' fetchpriority='high'>"
    },
    {
      stage: "07",
      name: "Autonomous Re-Verification Loop (/goal audit)",
      actor: "Autonomous Audit Loop",
      description: "Subagent re-navigates and re-runs traces and audit scripts to confirm all violations have been eliminated.",
      detail: "LCP drops from 3.8s to 1.4s (Good). Lighthouse Accessibility score rises from 0.82 to 1.00. Zero orphaned inputs remain. No regressions found.",
      actionCode: "VERIFICATION_SUCCESS: LCP = 1.4s, A11y = 100/100, Automated tests passed."
    },
    {
      stage: "08",
      name: "Walkthrough Delivery & Completion Signalling",
      actor: "Master Agent Loop",
      description: "Agent authors walkthrough.md summarizing changes, test evidence, and visual traces, then outputs mandatory completion token.",
      detail: "Full goal accomplished autonomously without manual babysitting. All artifacts written, verified, and complete.",
      actionCode: "ARTIFACT_WRITE: walkthrough.md\nOUTPUT: Final summary and goal completion token."
    }
  ]
};

