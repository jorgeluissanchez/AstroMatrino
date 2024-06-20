import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import InputCodeKeyBoard from "./InputCodeKeyBoard";
import { isMobile } from "react-device-detect";

interface InputCodeProps {
  min?: number;
  max: number;
  onChange?: (newCode: number[]) => void;
  code: number[];
}

function InputCode({ min=0, max, onChange, code }: InputCodeProps) {
  const [inputCode, setInputCode] = useState<number[]>(code);
  const [cursorPosition, setCursorPosition] = useState<number|null>(null);
  const [focusCode, setfocusCode] = useState<boolean>(false);
  const [codeKeyBoardIsOpen, setCodeKeyBoardIsOpen] = useState<boolean>(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (focusCode && cursorPosition !== null) {
      e.preventDefault();
      const col = cursorPosition;
      let newCol = col;
      if (e.key === 'ArrowLeft' && col > 0) newCol--;
      if (e.key === 'ArrowRight' && col < code.length - 1) newCol++;
      if (e.key === 'ArrowUp' && code[col] < max) {
        const newCode = [...inputCode];
        newCode[col] = code[col] + 1;
        setInputCode(newCode);
        if (onChange) {
        onChange(newCode);
        }
      }
      if (e.key === 'ArrowDown' && code[col] > min) {
        const newCode = [...inputCode];
        newCode[col] = code[col] - 1;
        setInputCode(newCode);
        if (onChange) {
        onChange(newCode);
        }
      }

      if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= min && parseInt(e.key) <= max) {
        const newCode = [...inputCode];
        newCode[col] = parseInt(e.key);
        setInputCode(newCode);
        if (col < inputCode.length - 1) newCol++;
        if (onChange) {
        onChange(newCode);
        }
      }

      setCursorPosition(newCol);
    }
  }, [cursorPosition, inputCode, focusCode, onChange, min, max]);

  useEffect(() => {
    if (focusCode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);


  useEffect(() => {
    setInputCode(code);
  }, [code]);

  const processTextToMatrix = (text: string) => {
    const newcode: number[] = text.trim().split(',').map(numStr => parseInt(numStr));
    const validCode = newcode.every(num => !isNaN(num) && num >= min && num <= max && Number.isInteger(num));
    

    if (validCode) {
      if (newcode.length === inputCode.length) {
        setInputCode(newcode);
        if (onChange){
        onChange(newcode);
        }
        toast("Modificado correctamente");
      } else {
        toast(`El número de columnas debe ser igual a ${inputCode.length}`);
      }
    } else {
      toast(`Asegúrate de que todos los números sean enteros entre ${min} y ${max}.`);
    }
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
    const text = inputCode.join(',');
    try {
      await navigator.clipboard.writeText(text);
      toast("Codigo copiado al portapapeles");
    } catch (error) {
      console.error('Error al copiar al portapapeles: ', error);
      toast("No se pudo copiar el código al portapapeles");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex w-fit flex-col items-center gap-2">
          <div
            className="flex w-fit items-center gap-2 outline-none bg-white"
            style={{ position: 'relative', cursor: 'text', userSelect: 'none' }}
            tabIndex={0} 
            onFocus={() => setfocusCode(true)}
            onBlur={() => { setfocusCode(false); setCursorPosition(5); }}
          >
            {inputCode.map((item, itemIndex) => (
                  <div
                    key={itemIndex + "item"}
                    className={`relative bg-white flex h-10 w-10 items-center justify-center border border-slate-200 text-sm transition-all rounded dark:border-slate-800 cursor-pointer ${cursorPosition === itemIndex ? 'z-10 ring-2 ring-slate-950 ring-offset-white dark:ring-slate-300 dark:ring-offset-slate-950' : 'hover:bg-slate-200'}`}
                    onClick={() => { if(isMobile){setCodeKeyBoardIsOpen(true) } else {setCursorPosition(itemIndex);} }}
                  >
                    {item}
                  </div>
            ))}
          </div>
        </div>
        {codeKeyBoardIsOpen && (
          <InputCodeKeyBoard
            min={min}
            max={max}
            code={inputCode}
            onChange={(prop) => {
              setInputCode(prop);
              if (onChange) {
                onChange(prop);
              }
            }}
            onClose={() => setCodeKeyBoardIsOpen(false)}
          />
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy}>Copiar</ContextMenuItem>
        <ContextMenuItem onClick={handlePaste}>Pegar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default InputCode;
