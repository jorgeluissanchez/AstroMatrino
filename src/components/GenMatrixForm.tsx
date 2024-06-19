import { Toaster } from "sonner";
import InputMatrix from "./InputMatrix";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import InputCode from "./InputCode";
import InputCodeList from "./InputCodeList";
import DisplayMatrix from "./DisplayMatrix";
import DisplayCodeList from "./DisplayCodeList";

function GenMatrixForm() {
  const [n, setN] = useState(3);
  const [z, setZ] = useState(2);
  const [codigos, setCodigos] = useState<string[]>([]);
  const [d, setD] = useState(0);
  const [l, setL] = useState(0);
  const [codigo, setCodigo] = useState<number[]>([0, 0, 0]);
  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0)));
  const paginationSize = 10

  return (
    <div>
      <h1 className="text-4xl mx-auto max-w-[600px] mb-10 font-bold text-warp text-center">
        Matrino: Generador de Matrices y parámetros
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col md:flex-row gap-4 justify-center md:col-span-2">
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz Generada</CardTitle>
              <CardDescription>
                Se muestra la Matriz generada por los codigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5 items-center">
                <InputMatrix
                  max={z - 1}
                  matrix={matrix}
                  onChange={(prop) => {
                    setMatrix(prop);
                  }
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz Generada</CardTitle>
              <CardDescription>
                Se muestra la Matriz generada por los codigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5 items-center">
                <DisplayMatrix
                  matrix={matrix}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Características Principales</CardTitle>
              <CardDescription>
                Introduce las características principales de la matriz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex gap-1.5 items-center">
                  <Label htmlFor="n">Longitud en N</Label>
                  <InputCode
                    max={6}
                    min={1}
                    code={[n]}
                    onChange={(prop) => {
                      setN(prop[0]);
                      setCodigo(new Array(prop[0]).fill(0));
                      setCodigos([]); // Limpiar los códigos cuando se cambia N
                    }}
                  />
                </div>

                <div className="flex gap-1.5 items-center">
                  <Label htmlFor="z">Nos Movemos en Z</Label>
                  <InputCode
                    max={4}
                    min={2}
                    code={[z]}
                    onChange={(prop) => {
                      setZ(prop[0]);
                      setCodigo(new Array(n).fill(0));
                      setCodigos([]); // Limpiar los códigos cuando se cambia Z
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Parámetros De La Matriz</CardTitle>
              <CardDescription>
                Podrás encontrar los parámetros de la matriz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex gap-1.5 items-center">
                  <Label htmlFor="d">Resultado de dimensión</Label>
                  <Input placeholder="Valor" disabled value={d}
                    className="w-12 h-10 text-center" />
                </div>

                <div className="flex gap-1.5 items-center">
                  <Label htmlFor="l">Resultado de longitud</Label>

                  <Input placeholder="Valor" disabled value={l}
                    className="w-12 h-10 text-center" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Códigos Lineales</CardTitle>
              <CardDescription>
                Introduce los códigos lineales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 items-center">
                <InputCode
                  max={z - 1}
                  code={codigo}
                  onChange={(prop) => {
                    setCodigo(prop);
                  }}
                />
                <Button
                  onClick={() => {
                    if (codigos.some((code) => code === codigo.join(""))) return;
                    setCodigos((prevCodigos) => [...prevCodigos, codigo.join("")]);
                  }}
                >
                  Añadir Codigo
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="w-full rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-6">
            <InputCodeList codeList={codigos} paginationSize={paginationSize} max={z - 1} long={n} onChange={(codigos) => setCodigos(codigos)} />
          </div>
          <div className="w-full rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-6">
            <DisplayCodeList codeList={codigos} paginationSize={paginationSize} />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default GenMatrixForm;
