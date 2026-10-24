import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { Workspace } from "@/components/workspace/Workspace";

export default function Page() {
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>
  );
}
