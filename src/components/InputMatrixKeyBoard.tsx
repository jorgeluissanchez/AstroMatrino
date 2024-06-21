import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";

interface InputMatrixKeyBoardProps {
  min?: number;
  max: number;
  onChange?: (newMatrix: number[][]) => void;
  matrix: number[][];
  onClose: () => void;
}

const ButtonList = [
  {
    key: '1',
    content: '1',
    disabled: false,
  },
  {
    key: '2',
    content: '2',
    disabled: false,
  },
  {
    key: '3',
    content: '3',
    disabled: false,
  },
  {
    key: '4',
    content: '4',
    disabled: false,
  },
  {
    key: '5',
    content: '5',
    disabled: false,
  },
  {
    key: '6',
    content: '6',
    disabled: false,
  },
  {
    key: '7',
    content: '7',
    disabled: false,
  },
  {
    key: '8',
    content: '8',
    disabled: false,
  },
  {
    key: '9',
    content: '9',
    disabled: false,
  },
  {
    key: '0',
    content: '0',
    disabled: false,
  },
  {
    key: 'arrow-up',
    content: <ArrowUpIcon className="w-6 h-6" />,
    disabled: false,
  },
  {
    key: 'ok',
    content: 'Ok',
    disabled: false,
  },
  {
    key: 'arrow-left',
    content: <ArrowLeftIcon className="w-6 h-6" />,
    disabled: false,
  },
  {
    key: 'arrow-down',
    content: <ArrowDownIcon className="w-6 h-6" />,
    disabled: false,
  },
  {
    key: 'arrow-right',
    content: <ArrowRightIcon className="w-6 h-6" />,
    disabled: false,
  },
];

function InputMatrixKeyBoard({ min = 0, max, onChange, matrix, onClose}: InputMatrixKeyBoardProps) {
  const [inputMatrixKeyBoard, setInputMatrixKeyBoard] = useState<number[][]>(matrix);
  const [cursorPosition, setCursorPosition] = useState<number[]>([0, 0]);

  const handleKeyDown = (key: string) => {
    const [row, col] = cursorPosition;
    let newRow = row;
    let newCol = col;

    if (key === 'arrow-up' && row > 0) newRow--;
    if (key === 'arrow-down' && row < inputMatrixKeyBoard.length - 1) newRow++;
    if (key === 'arrow-left' && col > 0) newCol--;
    if (key === 'arrow-right' && col < inputMatrixKeyBoard[0].length - 1) newCol++;
    if (key === 'ok') onClose();


    if (!isNaN(parseInt(key)) && parseInt(key) >= min && parseInt(key) <= max) {
      const newMatrix = [...inputMatrixKeyBoard];
      newMatrix[row][col] = parseInt(key);
      setInputMatrixKeyBoard(newMatrix);
      if (col < inputMatrixKeyBoard[0].length - 1) newCol++;
      else if (row < inputMatrixKeyBoard.length - 1) {
        newRow++;
        newCol = 0;
      }
      if (onChange) {
        onChange(newMatrix);
      }
    }

    setCursorPosition([newRow, newCol]);
  };

  useEffect(() => {
    setInputMatrixKeyBoard(matrix);
  }, [matrix]);

  return (
    <div className="absolute z-20 top-0 right-0 bg-white bg-opacity-80">
      <div className="relative flex flex-col h-screen w-screen">
        <div className="flex flex-1 items-center justify-center">
          <div className={"flex w-fit flex-col items-center gap-2"}>
            <div
              className="flex w-fit flex-col items-center gap-2 has-[:disabled]:opacity-50 outline-none bg-transparent scale-150"
              style={{ position: 'relative' }}
            >
              {inputMatrixKeyBoard.map((row, rowIndex) => (
                <div className="flex items-center gap-2" key={rowIndex + "row"}>
                  {row.map((col, colIndex) => (
                    <div
                      key={colIndex + "col"}
                      className={`relative bg-white flex h-10 w-10 items-center justify-center border border-slate-200 text-sm transition-all rounded dark:border-slate-800 ${cursorPosition[0] === rowIndex && cursorPosition[1] === colIndex ? 'z-10 ring-2 ring-slate-950 ring-offset-white dark:ring-slate-300 dark:ring-offset-slate-950' : 'hover:bg-slate-200'} cursor-pointer`}
                      onClick={() => { setCursorPosition([rowIndex, colIndex])}}
                    >
                      {col}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full bg-white border-t border-slate-200 p-10">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="grid grid-cols-3 gap-2 max-w-[320px] w-full">
              {ButtonList.map(({ key, content }: any, index) => (
                <Button
                  key={index}
                  className={'aspect-square w-full text-lg font-medium rounded-lg '}
                  disabled={(isNaN(parseInt(key)) || parseInt(key) >= min && parseInt(key) <= max) ? false : true}
                  onClick={() => {
                    handleKeyDown(key);
                  }}
                >
                  {typeof content === 'function' ? content() : content}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputMatrixKeyBoard;
