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
import FormAdicionarCategoria from "../form/categoriaCorte/FormAdicionarCategoria";
import FormEditarCategoria from "../form/categoriaCorte/FormEditarCategoria";

export default function TabelaCategoriasCortes() {
  const [categoriasCortes, setCategoriasCortes] = useState<CorteComCategoria[]>([]);
  const [selectedCategoriaCorte, setSelectedCategoriaCorte] = useState<CorteComCategoria | null>(null);
  const [showModalAdicionar, setShowModalAdicionar] = useState<boolean>(false);
  const [showModalEditar, setShowModalEditar] = useState<boolean>(false);
  const [showModalExcluir, setShowModalExcluir] = useState<boolean>(false);

  useEffect(() => {
      getCategoriasCortes();
  }, [])

  async function getCategoriasCortes() {
      const res = await fetch('/api/categoriasCortes');
      if(res.ok) {
          const body = await res.json();
          setCategoriasCortes(body.data);
      }
  }

  //const cortesArrChunks = useMemo(() => {
  //  const corteCat: {[key: string]: CorteComCategoria[]} = {};

  //  cortes.forEach(corte => {
  //    if(!corteCat[corte.categoriaId]) {
  //      corteCat[corte.categoriaId] = [corte];
  //    } else {
  //      corteCat[corte.categoriaId].push(corte);
  //    }
  //  });

  //  const cortesArr = Object.values(corteCat);

  //  return chunkArray(cortesArr, 2);

  //}, [cortes])

  //function formatarPdfCortes() {
  //  const pdfContent: any[] = [];
  //  cortesArrChunks.forEach((chunk) => {
  //    let columns: any = [];
  //    chunk.forEach((corteArr: CorteComCategoria[]) => {
  //      let colVal = {
  //        layout: 'lightHorizontalLines', // optional
  //        table: {
  //          // headers are automatically repeated if the table spans over multiple pages
  //          // you can declare how many rows should be treated as headers
  //          headerRows: 1,
  //          widths: [ '*', 'auto'],
  //          body: [
  //            [ { text: corteArr[0].categoria.nome, colSpan: 2, alignment: 'center'}, "" ],
  //          ]
  //        }
  //      };

  //      corteArr.forEach((corte) => {
  //        let corteLine = [corte.nome, corte.valor];
  //        colVal.table.body.push(corteLine);
  //      });

  //      columns.push(colVal);
  //    })
  //    pdfContent.push({columns: columns, columnGap: 50});
  //  })

  //  return pdfContent;

  //}

  //function gerarPdfCortes() {
  //  var dd = {
  //    content: formatarPdfCortes()
  //  }
  //  pdfMake.createPdf(dd).open();
  //}

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    getCategoriasCortes();
  }

  async function onDeletePress() {
    const res = await fetch('/api/categoriasCortes/' + selectedCategoriaCorte?.id, {
        method: 'DELETE'
    });

    if(res.ok) {
        setShowModalExcluir(false);
        getCategoriasCortes();
        return;
    }

    setShowModalExcluir(false);
    return;
  }

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
                                  Ações
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {categoriasCortes?.map((categoria) => (
                            <TableRow key={categoria.id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                      {categoria.nome}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                <button className="pr-2" onClick={() => {
                                  setShowModalEditar(true);
                                  setSelectedCategoriaCorte(categoria);
                                }}>Editar</button>

                                <button className="pl-2 text-red-600" onClick={() => {
                                  setShowModalExcluir(true);
                                  setSelectedCategoriaCorte(categoria);
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
        }}>Adicionar Categoria</button>
        <Modal 
          isOpen={showModalAdicionar} 
          onClose={() => {
            setShowModalAdicionar(false)
          }}
        >
            <FormAdicionarCategoria 
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
            <FormEditarCategoria 
              onSuccess={() => {
                setShowModalEditar(false)
                getCategoriasCortes()
              }}
              onSubmit={() => {}}
              defaultValue={selectedCategoriaCorte}
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
            <div className="text-center font-light text-neutral-600">Essa acao ira excluir o corte "{selectedCategoriaCorte?.nome ?? "Nao encontrado"}" da lista de precos</div>
            <div className="flex justify-center gap-8 pt-8">
                <button 
                    className="bg-red-600 text-white py-2 px-4 rounded-2xl"
                    onClick={onDeletePress}
                >Excluir</button>
                <button 
                    className="text-neutral-600" 
                    onClick={() => setShowModalExcluir(false)}
                >Cancelar</button>
            </div>
        </Modal>
    </>
  );
}
