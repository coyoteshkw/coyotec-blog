/**
 * 代码块增强：右上角复制按钮 + 超高代码块折叠
 *
 * 文章页与 Notes 页共用。挂载与 View Transitions 的生命周期由调用方负责，
 * 这里只导出幂等的初始化函数（内部用 dataset 标记避免重复绑定）。
 */

/** 为所有 <pre> 添加右上角复制按钮 */
function attachCopyButtons(): void {
  const copyButtonLabel = "Copy";
  const codeBlocks = Array.from(
    document.querySelectorAll<HTMLPreElement>("pre")
  );

  for (const codeBlock of codeBlocks) {
    // 已处理过则跳过
    if (codeBlock.dataset.copyBound === "1") continue;
    codeBlock.dataset.copyBound = "1";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const computedStyle = getComputedStyle(codeBlock);
    const hasFileNameOffset =
      computedStyle.getPropertyValue("--file-name-offset").trim() !== "";

    const topClass = hasFileNameOffset ? "top-(--file-name-offset)" : "-top-3";

    const copyButton = document.createElement("button");
    copyButton.className = `copy-code absolute end-3 ${topClass} rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium`;
    copyButton.innerHTML = copyButtonLabel;
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    copyButton.addEventListener("click", async () => {
      const text = codeBlock.querySelector("code")?.innerText ?? "";
      await navigator.clipboard.writeText(text);

      copyButton.innerText = "Copied";
      setTimeout(() => {
        copyButton.innerText = copyButtonLabel;
      }, 700);
    });
  }
}

/** 超过 MAX_HEIGHT 的代码块默认折叠，点击展开/收起 */
function attachCodeCollapse(): void {
  const MAX_HEIGHT = 400;
  const codeBlocks = Array.from(
    document.querySelectorAll<HTMLElement>(".astro-code")
  );

  for (const codeBlock of codeBlocks) {
    if (codeBlock.dataset.collapseBound === "1") continue;
    if (codeBlock.scrollHeight <= MAX_HEIGHT) continue;

    codeBlock.dataset.collapseBound = "1";

    const wrapper = codeBlock.parentElement;
    if (!wrapper) continue;
    wrapper.classList.add("code-collapsible");

    codeBlock.style.maxHeight = MAX_HEIGHT + "px";
    codeBlock.style.overflowX = "auto";
    codeBlock.style.overflowY = "hidden";

    const mask = document.createElement("div");
    mask.className = "code-mask";
    wrapper.appendChild(mask);

    const iconDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m6 9 6 6 6-6"/></svg>`;
    const iconUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m18 15-6-6-6 6"/></svg>`;

    const toggleBtn = document.createElement("button");
    toggleBtn.className =
      "code-toggle absolute left-1/2 -translate-x-1/2 bottom-3 z-10 flex items-center justify-center rounded-full bg-muted border border-muted px-3 py-1.5 text-foreground shadow transition-colors hover:bg-accent hover:text-accent-foreground";
    toggleBtn.innerHTML = iconDown;
    toggleBtn.setAttribute("aria-label", "展开代码");
    wrapper.appendChild(toggleBtn);

    let expanded = false;
    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      if (expanded) {
        codeBlock.style.maxHeight = "none";
        codeBlock.style.overflow = "auto";
        codeBlock.style.overflowY = "visible";
        codeBlock.style.overflowX = "auto";
        mask.classList.add("code-mask-hidden");
        toggleBtn.innerHTML = iconUp;
        toggleBtn.setAttribute("aria-label", "收起代码");
      } else {
        codeBlock.style.maxHeight = MAX_HEIGHT + "px";
        codeBlock.style.overflowX = "auto";
        codeBlock.style.overflowY = "hidden";
        mask.classList.remove("code-mask-hidden");
        toggleBtn.innerHTML = iconDown;
        toggleBtn.setAttribute("aria-label", "展开代码");
      }
    });
  }
}

/** 初始化代码块增强功能（幂等，可重复调用） */
export function setupCodeBlocks(): void {
  attachCopyButtons();
  // 延迟到布局完成后测量高度，避免首次加载时 scrollHeight 不准
  requestAnimationFrame(() => attachCodeCollapse());
}
