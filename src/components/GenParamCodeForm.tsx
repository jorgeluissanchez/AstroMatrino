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

function GenParamCodeForm() {
  const [n, setN] = useState(3);
  const [z, setZ] = useState(2);
  const [k, setK] = useState(2);
  const [codigos, setCodigos] = useState<string[]>([]);
  const [d, setD] = useState(0);
  const [l, setL] = useState(0);
  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => 0)));
  const paginationSize = 10

  const onSubmit = () => {
    const requestData = {
      z: z,
      matrix: matrix
    };
    fetch('https://matrino-dev-gc3hjhi3da-uc.a.run.app/v1/code-theory/lineal-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCodigos(data.codewords);
          setD(data.k);
          setL(data.n);
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
              <CardTitle>Codigos generados</CardTitle>
              <CardDescription>
                Se muestran los codigos generados por la matriz generadora
              </CardDescription>
            </CardHeader>
            <CardContent>
              
            <div className="flex flex-col gap-4 items-center">
            <DisplayCodeList codeList={codigos} paginationSize={paginationSize} />
            <Button onClick={onSubmit}>Generar Codigos lineales</Button>
            </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Parámetros Generados</CardTitle>
              <CardDescription>
                Podrás encontrar los parametros de los códigos generados
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
                      setCodigos([]);
                      setD(0);
                      setL(0);
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
                      setCodigos([]);
                      setD(0);
                      setL(0);
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
                      setCodigos([]);
                      setD(0);
                      setL(0);
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
                    setCodigos([]);
                    setD(0);
                    setL(0);
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

export default GenParamCodeForm;