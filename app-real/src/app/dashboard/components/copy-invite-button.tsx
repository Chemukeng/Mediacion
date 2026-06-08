"use client";

import { Button } from "@/components/ui/button";

export function CopyInviteButton({ caseId }: { caseId: string }) {
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/invite/${caseId}`);
        alert("Enlace copiado al portapapeles");
      }}
    >
      Copiar enlace de invitación
    </Button>
  );
}
