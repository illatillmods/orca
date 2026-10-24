import EditorAutosaveController from './editor/EditorAutosaveController'
import { useAnyBrowserGuestNeedsPaint } from './browser-pane/host-guest/browser-guest-paint-retention'
import { TerminalTitlebarTabs } from './TerminalTitlebarTabs'
import { TerminalSplitWorkspaceSurfaces } from './TerminalSplitWorkspaceSurfaces'
import { TerminalLegacyWorkspaceSurface } from './TerminalLegacyWorkspaceSurface'
import { TerminalWorkspaceDialogs } from './TerminalWorkspaceDialogs'
import type { TerminalController } from './use-terminal-controller'
import { useAppStore } from '@/store'
import { selectShownWorkspaceView } from '@/lib/workspace-view-catalog'
import { WorkspaceViewToolbar } from './workspace-grid-view/WorkspaceViewToolbar'
import { WorkspaceViewPicker } from './workspace-grid-view/WorkspaceViewPicker'
import { useWorkspaceViewSelection } from '@/lib/workspace-view-selection'

export function TerminalSurface({
  controller
}: {
  controller: TerminalController
}): React.JSX.Element {
  const { renderedActiveWorktreeId } = controller
  useWorkspaceViewSelection(controller.workspaceSessionReady)
  const workspaceView = useAppStore(selectShownWorkspaceView)
  const retainBrowserGuestPaint = useAnyBrowserGuestNeedsPaint(!renderedActiveWorktreeId)
  return (
    <div
      // Why: already out of flow via the workbench container when hidden, so retention only
      // has to drop `hidden` — it does not need to leave the flex column a second time.
      className={`flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden${
        renderedActiveWorktreeId || workspaceView
          ? ''
          : retainBrowserGuestPaint
            ? ' opacity-0 pointer-events-none'
            : ' hidden'
      }`}
      data-rendered-active-worktree-id={renderedActiveWorktreeId ?? undefined}
    >
      <EditorAutosaveController />
      <WorkspaceViewToolbar />
      <TerminalTitlebarTabs controller={controller} />
      <TerminalSplitWorkspaceSurfaces controller={controller} />
      <TerminalLegacyWorkspaceSurface controller={controller} />
      <TerminalWorkspaceDialogs controller={controller} />
      <WorkspaceViewPicker />
    </div>
  )
}
