import React, { useState } from 'react';
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from './ui/button';

interface DisplayCodeListProps {
  codeList: string[];
  paginationSize: number;
}

const DisplayCodeList: React.FC<DisplayCodeListProps> = ({ codeList, paginationSize }) => {
  const [paginationIndex, setPaginationIndex] = useState(0);

  const handleCopy = async () => {
    const text = codeList.map(code => code.split('').join(',')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast("Codigos copiados al portapapeles");
    } catch (error) {
      console.error('Error al copiar al portapapeles: ', error);
      toast("No se pudieron copiar los codigos al portapapeles");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {codeList.slice(paginationIndex, paginationIndex + paginationSize).map((code, i) => (
            <div
              key={i}
              className="flex justify-center items-center bg-slate-100 py-2 px-4 rounded-md text-center cursor-not-allowed opacity-50"
            >
              <p>{code}</p>
            </div>
          ))}
          {codeList.length === 0 && <p className="text-center col-span-3 md:col-span-5">No hay códigos</p>}
          {codeList.length > paginationSize && (
            <div className="col-span-3 md:col-span-5 flex justify-center items-center gap-2">
              <Button
                onClick={() => setPaginationIndex((prevIndex) => Math.max(prevIndex - paginationSize, 0))}
                disabled={paginationIndex === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={() => setPaginationIndex((prevIndex) => Math.min(prevIndex + paginationSize, codeList.length))}
                disabled={paginationIndex + paginationSize >= codeList.length}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy}>Copiar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DisplayCodeList;
