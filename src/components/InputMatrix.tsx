import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface InputMatrixProps {
  min?: number;
  max: number;
  onChange?: (newMatrix: number[][]) => void;
  matrix: number[][];
}

function InputMatrix({ min = 0, max, onChange, matrix }: InputMatrixProps) {
  const [inputMatrix, setInputMatrix] = useState<number[][]>(matrix);
  const [cursorPosition, setCursorPosition] = useState<number[]>([]);
  const [focusMatrix, setFocusMatrix] = useState<boolean>(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (focusMatrix) {
      e.preventDefault();
      const [row, col] = cursorPosition;
      let newRow = row;
      let newCol = col;

      if (e.key === 'ArrowUp' && row > 0) newRow--;
      if (e.key === 'ArrowDown' && row < inputMatrix.length - 1) newRow++;
      if (e.key === 'ArrowLeft' && col > 0) newCol--;
      if (e.key === 'ArrowRight' && col < inputMatrix[0].length - 1) newCol++;

      if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= min && parseInt(e.key) <= max) {
        const newMatrix = [...inputMatrix];
        newMatrix[row][col] = parseInt(e.key);
        setInputMatrix(newMatrix);
        if (col < inputMatrix[0].length - 1) newCol++;
        else if (row < inputMatrix.length - 1) {
          newRow++;
          newCol = 0;
        }
        if (onChange) {
          onChange(newMatrix);
        }
      }

      setCursorPosition([newRow, newCol]);
    }
  }, [cursorPosition, inputMatrix, focusMatrix, onChange, min, max]);

  useEffect(() => {
    if (focusMatrix) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  useEffect(() => {
    setInputMatrix(matrix);
  }, [matrix]);

  const processTextToMatrix = (text: string) => {
    const rows = text.trim().split('\n');
    let isValid = true;
    const newMatrix: number[][] = rows.map(row => {
      const nums = row.trim().split(',').map(numStr => parseInt(numStr));
      const validNums = nums.every(num => !isNaN(num) && num >= min && num <= max && Number.isInteger(num));
      if (!validNums || nums.length !== inputMatrix[0].length) isValid = false;
      return nums;
    });

    if (isValid) {
      if (newMatrix.length === inputMatrix.length) {
        setInputMatrix(newMatrix);
        if (onChange) {
          onChange(newMatrix);
        }
        toast("Modificado correctamente");
      } else {
        toast(`El número de filas no debe ser igual a ${inputMatrix.length}`);
      }
    } else {
      toast(`Asegúrate de que los elementos de cada fila tengan ${inputMatrix[0].length} números sean enteros entre ${min} y ${max} separados por comas.`);
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
          <div
            className="flex w-fit flex-col items-center gap-2 has-[:disabled]:opacity-50 outline-none bg-white"
            style={{ position: 'relative' }}
            tabIndex={0}
            onFocus={() => setFocusMatrix(true)}
            onBlur={() => { setFocusMatrix(false); setCursorPosition([]); }}
          >
            {inputMatrix.map((row, rowIndex) => (
              <div className="flex items-center gap-2" key={rowIndex + "row"}>
                {row.map((col, colIndex) => (
                  <div
                    key={colIndex + "col"}
                    className={`relative bg-white flex h-10 w-10 items-center justify-center border border-slate-200 text-sm transition-all rounded dark:border-slate-800 ${cursorPosition[0] === rowIndex && cursorPosition[1] === colIndex ? 'z-10 ring-2 ring-slate-950 ring-offset-white dark:ring-slate-300 dark:ring-offset-slate-950' : 'hover:bg-slate-200'} cursor-pointer`}
                    onClick={() => { setCursorPosition([rowIndex, colIndex]); const fakeInput = document.createElement('input'); if (fakeInput) fakeInput.focus(); }}
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
        <ContextMenuItem onClick={handlePaste}>Pegar</ContextMenuItem>
        <ContextMenuItem onClick={handleFileUpload}>Buscar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default InputMatrix;
