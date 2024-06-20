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

function GenCodeDualForm() {
  const [n, setN] = useState(4);
  const [z, setZ] = useState(2);
  const [codigos, setCodigos] = useState<string[]>([]);
  const [codigosDuales, setCodigosDuales] = useState<string[]>([]);
  const [codigo, setCodigo] = useState<number[]>([0, 0, 0, 0]);
  const paginationSize = 10

  const onSubmit = () => {
    const requestData = {
      z: z,
      code: codigos
    };
    fetch('https://matrino-dev-gc3hjhi3da-uc.a.run.app/v1/code-theory/dual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCodigosDuales(data.dual);
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
        <div className="flex gap-4 justify-center">

          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Codigos duales generados</CardTitle>
              <CardDescription>
                Se muestran los codigos duales generados por los codigos lineales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 items-center">
                <DisplayCodeList codeList={codigosDuales} paginationSize={paginationSize} />
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
                      setCodigo(new Array(prop[0]).fill(0));
                      setCodigos([]);
                      setCodigosDuales([]);
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
                      setCodigo(new Array(n).fill(0));
                      setCodigos([]);
                      setCodigosDuales([]);
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
                    setCodigosDuales([]);
                  }}
                >
                  Añadir Codigo
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="w-full rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-6">
            <InputCodeList codeList={codigos} paginationSize={paginationSize} max={z - 1} long={n} onChange={(codigos) => {setCodigos(codigos); setCodigosDuales([]); }} />
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default GenCodeDualForm;

