import React, { ChangeEvent, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";
import { useEffectOnce } from "../hooks/useEffectOnce";

export interface TableCellProps {
  children: ReactNode
}

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return (
    <td>
      {children}
    </td>
  )
}

export interface TableRowProps {
  values: string[]
}

export const TableRow: React.FC<PropsWithChildren<TableRowProps>> = ({ values, children }) => {
  const childElements = React.Children.map(children, (child, index) => {
    return React.cloneElement(child as ReactElement<TableCellProps>, {
      key: index
    });
  });

  return (
    <tr className="even:bg-cscol-300 odd:bg-cscol-100 text-xl font-bold">
      {childElements}
    </tr>
  )
}

interface ColumnFilter {
  key: string
}

interface ColumnConfig {
  label: string,
  searchable?: boolean
}

export interface TableProps {
  headers: ColumnConfig[],
  loading?: boolean,
}

const Table: React.FC<PropsWithChildren<TableProps>> = ({ headers, loading = false, children }) => {
  const [filters, set_filters] = useState<ColumnFilter[]>(new Array(headers.length).fill(null).map(() => ({key: ""})));
  const [filter_open, set_filter_open] = useState<number>(-1);
  const [filtered, set_filtered] = useState<(string | number | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<any>)>();

  useEffectOnce(() => {
    set_filtered(filter_children());
  }, [children])

  function filter_children() {
    const filt = React.Children.toArray(children).filter((child) => {
      if (React.isValidElement(child)) {
        const childValues = child.props.values;
        for (let i = 0; i < childValues.length; i++) {
          if (!childValues[i].toLowerCase().includes(filters[i].key)) {
            return false;
          }
        }
      }

      return true;
    })

    return filt;
  }

  function open_filter(index: number) {
    if (headers[index].searchable) {
      set_filter_open(index);
    } else {
      set_filter_open(-1);
    }
  }

  function is_filter_open(index: number) {
    return (filter_open === index || filters[index].key.length > 0);
  }

  function filter_change(e: ChangeEvent<HTMLInputElement>, index: number) {
    const filter_copy = filters;
    filter_copy[index].key = e.target.value.toLowerCase();
    set_filters(filter_copy);
    set_filtered(filter_children());
  }

  if (loading) {
    return <Loading />
  }
  
  return (
    <div className="flex w-full h-5/6 overflow-y-auto">
      <table className="table-auto border-separate w-full h-fit text-cscol-500 text-center">
        <thead className="sticky top-0">
          <tr key={"head"}>
            {headers.map((config, index) => {
              return (
                <th key={index} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">
                  {!is_filter_open(index) &&
                  <button 
                    onClick={() => open_filter(index)} 
                    className={`flex w-full h-full justify-center ${config.searchable ? "hover:text-cscol-300" : "cursor-default"}`}
                  >
                    {config.label}
                    {config.searchable && <Image className="my-auto mx-1" src="/filter-100.png" width={0} height={0} style={{ width: "16px", height: "20px" }} alt="filter" />}
                  </button>}
                  {is_filter_open(index) &&
                  <div className="flex w-full h-full justify-center">
                    {config.label}
                    <input className="ml-3" onChange={ev => filter_change(ev, index)} autoFocus />
                  </div>}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="text-cscol-500 text-center">
          {filtered}
        </tbody>
      </table>
    </div>
  )
}

export default Table;