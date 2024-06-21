import { Toaster, toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import InputCode from "./InputCode";
import InputCodeList from "./InputCodeList";
import DisplayMatrix from "./DisplayMatrix";
import DisplayCodeList from "./DisplayCodeList";
import InputMatrix from "./InputMatrix";

function GenMatrixControlForm() {
  const [n, setN] = useState(4);
  const [z, setZ] = useState(2);
  const [k, setK] = useState(2);
  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => 0)));
  const [controlMatrix, setControlMatrix] = useState<number[][]>(Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => 0)));

  const onSubmit = () => {
    const requestData = {
      n: n,
      z: z,
      matrix: matrix
    };
    fetch('https://matrino-dev-gc3hjhi3da-uc.a.run.app/v1/code-theory/generator-to-control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setControlMatrix(data.matrix);
          toast("Solicitud exitosa");
        }
        else {
          toast("Ha ocurrido un error");
        }
      })
      .catch((error) => {
        toast("Ha ocurrido un error");
      });
  }

  return (
    <>
      <div className="w-full grid gap-4 md:grid-cols-2">
        <div className="flex gap-4 justify-center md:col-span-2">

          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz de control Generada</CardTitle>
              <CardDescription>
                Se muestra la matriz de control dada por la generadora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 items-center">
                <DisplayMatrix
                  matrix={controlMatrix}
                />
                <Button onClick={onSubmit}>Generar Matriz de Control</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Parametros</CardTitle>
              <CardDescription>
                Introduce los parametros de la matriz generadora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex gap-1.5 items-center justify-between">
                  <Label htmlFor="n">Longitud en N</Label>
                  <InputCode
                    max={6}
                    min={2}
                    code={[n]}
                    onChange={(prop) => {
                      setN(prop[0]);
                      setMatrix(Array.from({ length: k }, () => Array.from({ length: prop[0] }, () => 0)));
                      setControlMatrix(Array.from({ length: 2 }, () => Array.from({ length: prop[0] }, () => 0)));
                    }}
                  />
                </div>

                <div className="flex gap-1.5 items-center justify-between">
                  <Label htmlFor="k">Dimension en K</Label>
                  <InputCode
                    max={4}
                    min={2}
                    code={[k]}
                    onChange={(prop) => {
                      setK(prop[0]);
                      setMatrix(Array.from({ length: prop[0] }, () => Array.from({ length: n }, () => 0)));
                      setControlMatrix(Array.from({ length: 2 }, () => Array.from({ length: n }, () => 0)));

                    }}
                  />
                </div>
                <div className="flex gap-1.5 items-center  justify-between">
                  <Label htmlFor="z">Nos Movemos en Z</Label>
                  <InputCode
                    max={4}
                    min={2}
                    code={[z]}
                    onChange={(prop) => {
                      setZ(prop[0]);
                      setMatrix(Array.from({ length: k }, () => Array.from({ length: n }, () => 0)));
                      setControlMatrix(Array.from({ length: 2 }, () => Array.from({ length: n }, () => 0)));
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
        <div className="flex flex-col gap-4 items-center">

          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz Generadora</CardTitle>
              <CardDescription>
                Introduce los códigos de la matriz generadora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5 items-center">
                <InputMatrix
                  max={z - 1}
                  matrix={matrix}
                  onChange={(prop) => {
                    setMatrix(prop);
                    setControlMatrix(Array.from({ length: 2 }, () => Array.from({ length: prop[0].length }, () => 0)));
                  }
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default GenMatrixControlForm;


