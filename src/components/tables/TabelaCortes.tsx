"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import FormAdicionarCorte from "../form/FormAdicionarCorte";

export default function TabelaCortes() {
  const [cortes, setCortes] = useState<CorteComCategoria[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
      getCortes();
  }, [])

  async function getCortes() {
      const res = await fetch('/api/cortes');
      if(res.ok) {
          const body = await res.json();
          setCortes(body.data);
      }
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

    return pdfContent;

  }

  function gerarPdfCortes() {
    var dd = {
      content: formatarPdfCortes()
    }
    pdfMake.createPdf(dd).open();
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
                                  Categoria
                                </TableCell>
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                  Valor
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
                            </TableRow>
                          ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <button className="px-4 mx-4 bg-blue-600 text-white rounded-2xl" onClick={() => setShowModal(true)}>Adicionar Corte</button>
        <button onClick={() => gerarPdfCortes()}>Baixar Pdf</button>
        <Modal isOpen={showModal} onClose={() => {setShowModal(false)}}>
            <FormAdicionarCorte />
        </Modal>
    </>
  );
}
