import { useState } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface DisplayMatrixProps {
  matrix: number[][];
}

function DisplayMatrix({ matrix }: DisplayMatrixProps) {
  const [inputMatrix] = useState<number[][]>(matrix);

  const handleCopy = async () => {
    const text = inputMatrix.map(row => row.join(',')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast("Matriz copiada al portapapeles");
    } catch (error) {
      console.error('Error al copiar al portapapeles: ', error);
      toast("No se pudo copiar la matriz al portapapeles");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex w-fit flex-col items-center gap-2">
          <div className="flex w-fit flex-col items-center gap-2 bg-white">
            {inputMatrix.map((row, rowIndex) => (
              <div className="flex items-center gap-2" key={rowIndex + "row"}>
                {row.map((col, colIndex) => (
                  <div
                    key={colIndex + "col"}
                    className="relative bg-white flex h-10 w-10 items-center justify-center border border-slate-200 text-sm transition-all rounded dark:border-slate-800 cursor-not-allowed opacity-50"
                  >
                    {col}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy}>Copiar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default DisplayMatrix;
