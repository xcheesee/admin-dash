"use client"
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import pdfMake from 'pdfmake/build/pdfmake'
import "pdfmake/build/vfs_fonts";
import { CorteComCategoria } from "@/lib/types";
import { chunkArray } from "@/lib/utils";
import { Modal } from "../ui/modal";
import FormAdicionarCorte from "../form/cortes/FormAdicionarCorte";
import FormEditarCorte from "../form/cortes/FormEditarCorte";
import Spinner from "../ui/Spinner";

export default function TabelaCortes() {
  const [cortes, setCortes] = useState<CorteComCategoria[]>([]);
  const [selectedCorte, setSelectedCorte] = useState<CorteComCategoria | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string>("");

  const [loadingCortes, setLoadingCortes] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [showModalAdicionar, setShowModalAdicionar] = useState<boolean>(false);
  const [showModalEditar, setShowModalEditar] = useState<boolean>(false);
  const [showModalExcluir, setShowModalExcluir] = useState<boolean>(false);

  useEffect(() => {
      getCortes();
  }, [])

  async function getCortes() {
      setLoadingCortes(true)
      const res = await fetch('/api/cortes');
      if(res.ok) {
          const body = await res.json();
          setCortes(body.data);
      }
      setLoadingCortes(false);
  }

  const cortesArrChunks = useMemo(() => {
    const corteCat: {[key: string]: CorteComCategoria[]} = {};

    cortes.forEach(corte => {
      if(!corteCat[corte.categoriaId]) {
        corteCat[corte.categoriaId] = [corte];
      } else {
        corteCat[corte.categoriaId].push(corte);
      }
    });

    const cortesArr = Object.values(corteCat);

    return chunkArray(cortesArr, 2);

  }, [cortes])

  function formatarPdfCortes() {
    const pdfContent: any[] = [];
    cortesArrChunks.forEach((chunk) => {
      let columns: any = [];
      chunk.forEach((corteArr: CorteComCategoria[]) => {
        let colVal = {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto'],
            body: [
              [ { text: corteArr[0].categoria.nome, colSpan: 2, alignment: 'center'}, "" ],
            ]
          }
        };

        corteArr.forEach((corte) => {
          let corteLine = [corte.nome, corte.valor];
          colVal.table.body.push(corteLine);
        });

        columns.push(colVal);
      })
      pdfContent.push({columns: columns, columnGap: 50});
    })

    const footerPdf = [
        {
            text: "Whatsapp: (11) 93148-4557", marginTop: 24
        },
        {
            text: "Telefone: (11) 2275-4432"
        },
        {
            text: "* Tabela valida para o dia: " + new Date(Date.now()).toLocaleString('pt-BR').split(',')[0]
        }
    ]

    pdfContent.push(...footerPdf);

    return pdfContent;

  }

  function gerarPdfCortes() {
    var dd = {
      content: formatarPdfCortes()
    }
    pdfMake.createPdf(dd).open();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    getCortes();
  }

  async function onDeletePress() {
    setErrorFeedback("");
    setLoadingDelete(true);
    const res = await fetch('/api/cortes/' + selectedCorte?.id, {
        method: 'DELETE'
    });
    setLoadingDelete(false);

    if(res.ok) {
        getCortes();
        setShowModalExcluir(false);
    } else {
        const errBody = await res.json();
        setErrorFeedback(errBody.message);
    }

    return;
  }

  if(loadingCortes) return (
    <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
    </div>);

  return (
    <>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Nome
                                </TableCell>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Categoria
                                </TableCell>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Valor
                                </TableCell>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Ações
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {cortes?.map((corte) => (
                            <TableRow key={corte.id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                      {corte.nome}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {corte.categoria.nome}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                R$ {corte.valor}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <button className="pr-2" onClick={() => {
                                  setShowModalEditar(true);
                                  setSelectedCorte(corte);
                                }}>Editar</button>

                                <button className="pl-2 text-red-600" onClick={() => {
                                  setShowModalExcluir(true);
                                  setSelectedCorte(corte);
                                }}>Excluir</button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <button className="px-4 mx-4 bg-blue-600 text-white rounded-2xl" onClick={() => {
          setShowModalAdicionar(true);
        }}>Adicionar Corte</button>
        <button onClick={() => gerarPdfCortes()}>Baixar Pdf</button>
        <Modal 
          isOpen={showModalAdicionar} 
          onClose={() => {
            setShowModalAdicionar(false)
          }}
        >
            <FormAdicionarCorte 
              onSuccess={() => {
              setShowModalAdicionar(false)
              }} 
              onSubmit={onSubmit} 
            />
        </Modal>

        <Modal 
          isOpen={showModalEditar} 
          onClose={() => {
            setShowModalEditar(false)
          }}
        >
            <FormEditarCorte 
              onSuccess={() => {
                setShowModalEditar(false)
                getCortes()
              }}
              onSubmit={() => {}}
              defaultValue={selectedCorte}
            />
        </Modal>

        <Modal
            isOpen={showModalExcluir}
            onClose={() => {
                setShowModalExcluir(false)
            }}
            className="w-auto px-8 pb-4 pt-2"
        >
            <div className="text-center">Deseja realmente excluir o corte?</div>

            <div className="text-center font-light text-neutral-600">Essa acao ira excluir o corte "{selectedCorte?.nome ?? "Nao encontrado"}" da lista de precos</div>

            <div className="text-center font-light text-red-600">{errorFeedback}</div>

            <div className="flex justify-center gap-8 pt-8">
                <button 
                    className="bg-red-600 text-white py-2 px-4 rounded-2xl"
                    disabled={loadingDelete}
                    onClick={onDeletePress}
                ><div className="flex justify-center items-center gap-8">Excluir {loadingDelete && <Spinner />}</div></button>
                <button 
                    className="text-neutral-600" 
                    onClick={() => {
                        setErrorFeedback("");
                        setShowModalExcluir(false);
                    }}
                >Cancelar</button>
            </div>
        </Modal>
    </>
  );
}
