import React from "react";
import { TableRowComponent } from "./TableRow.tsx";
import {
  calculateSubtotals,
  distributeToChildren,
} from "../utils/calculations.ts";
import { TableData, TableRow } from "../types";

const initialData: TableData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      originalValue: 1500,
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
          originalValue: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
          originalValue: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
          originalValue: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
          originalValue: 700,
        },
      ],
    },
  ],
};

export default function Table() {
  const [data, setData] = React.useState(initialData);

  const updateRowValue = (
    rows: TableRow[],
    id: string,
    newValue: number,
    isPercentage: boolean
  ): TableRow[] => {
    return rows.map((row) => {
      if (row.id === id) {
        const currentValue = row.value;
        const updatedValue = isPercentage
          ? currentValue + (currentValue * newValue) / 100
          : newValue;

        if (row.children) {
          return distributeToChildren(row, updatedValue);
        }

        return {
          ...row,
          value: Number(updatedValue.toFixed(2)),
          variance: (
            ((updatedValue - (row.originalValue || updatedValue)) /
              (row.originalValue || updatedValue)) *
            100
          ).toFixed(2),
        };
      }

      if (row.children) {
        return {
          ...row,
          children: updateRowValue(row.children, id, newValue, isPercentage),
        };
      }

      return row;
    });
  };

  const handleUpdateValue = (
    id: string,
    newValue: number,
    isPercentage: boolean
  ) => {
    const updatedRows = updateRowValue(data.rows, id, newValue, isPercentage);
    setData({ rows: calculateSubtotals(updatedRows) });
  };

  const calculateGrandTotal = (rows: TableRow[]): number => {
    return rows.reduce((total, row) => {
      if (!row.children) {
        return total + row.value;
      }
      return total + calculateGrandTotal(row.children);
    }, 0);
  };

  const grandTotal = calculateGrandTotal(data.rows);

  return (
    <div className="container p-6 mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3">Input</th>
              <th className="px-4 py-3">Allocation %</th>
              <th className="px-4 py-3">Allocation Val</th>
              <th className="px-4 py-3 text-right">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <TableRowComponent
                key={row.id}
                row={row}
                onUpdateValue={handleUpdateValue}
              />
            ))}
            <tr className="font-bold border-t-2 border-gray-300">
              <td className="px-4 py-3">Grand Total</td>
              <td className="px-4 py-3 text-right">{grandTotal.toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
