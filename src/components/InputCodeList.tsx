import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface InputCodeListProps {
  codeList: string[];
  paginationSize: number;
  max: number;
  long: number;
  onChange: (codigos: string[]) => void;
}

const InputCodeList: React.FC<InputCodeListProps> = ({ codeList, paginationSize, onChange, max, long }) => {
  const [codes, setCodes] = useState<string[]>(codeList);
  const [paginationIndex, setPaginationIndex] = useState(0);

  useEffect(() => {
    setCodes(codeList);
    setPaginationIndex(0);
  }, [codeList]);

  const processTextToMatrix = (text: string) => {
    console.log(text);
    const rows = text.trim().split('\n');
    let isValid = true;
    const uniqueCodes = new Set<string>();
    const newMatrix: number[][] = rows.map(row => {
      const nums = row.trim().split(',').map(numStr => parseInt(numStr));
      const validNums = nums.every(num => !isNaN(num) && num >= 0 && num <= max && Number.isInteger(num));
      if (!validNums || nums.length !== long) isValid = false;
      return nums;
    });

    if (isValid) {
      newMatrix.forEach(row => {
        const code = row.join(',');
        if (uniqueCodes.has(code)) {
          isValid = false;
        } else {
          uniqueCodes.add(code);
        }
      });
    }

    if (isValid) {
      setCodes(newMatrix.map(row => row.join('')));
      if (onChange) {
        onChange(newMatrix.map(row => row.join('')));
      }
      toast("Input actualizado");
    } else {
      toast(`Asegúrate de que los códigos tengan ${long} números, sean enteros entre 0 y ${max}, separados por comas, y que no haya códigos repetidos.`);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          processTextToMatrix(text);
        };
        reader.readAsText(file);
      } else {
        toast("Solo se aceptan archivos .txt");
      }
    };
    input.click();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        processTextToMatrix(text);
      } else {
        toast("No hay texto en el portapapeles");
      }
    } catch (error) {
      console.error('Error al leer el portapapeles: ', error);
      toast("No se pudo leer el portapapeles. Asegúrate de haber copiado texto válido.");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {codes.slice(paginationIndex, paginationIndex + paginationSize).map((code, i) => (
            <div
              key={i}
              className="flex justify-center items-center bg-slate-100 py-2 px-4 rounded-md text-center hover:bg-slate-200 hover:cursor-pointer"
              onClick={() => onChange(codeList.filter((c) => c !== code))}
            >
              <p>{code}</p>
            </div>
          ))}
          {codes.length === 0 && <p className="text-center col-span-3 md:col-span-5">No hay códigos</p>}
          {codes.length > paginationSize && (
            <div className="col-span-3 md:col-span-5 flex justify-center items-center gap-2">
              <Button
                onClick={() => setPaginationIndex((prevIndex) => Math.max(prevIndex - paginationSize, 0))}
                disabled={paginationIndex === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={() => setPaginationIndex((prevIndex) => Math.min(prevIndex + paginationSize, codes.length))}
                disabled={paginationIndex + paginationSize >= codes.length}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handlePaste}>Pegar</ContextMenuItem>
        <ContextMenuItem onClick={handleFileUpload}>Buscar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default InputCodeList;
