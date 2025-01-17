import React, { useState } from "react";
import { TableRow } from "../types";

interface Props {
  key: string;
  row: TableRow;
  level?: number;
  onUpdateValue: (id: string, newValue: number, isPercentage: boolean) => void;
}

export function TableRowComponent({
  key,
  row,
  level = 0,
  onUpdateValue,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleAllocationClick = (isPercentage: boolean) => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    onUpdateValue(row.id, value, isPercentage);
    setInputValue("");
  };

  return (
    <>
      <tr key={key} className="border-b border-gray-200">
        <td className="px-4 py-2">
          <span style={{ marginLeft: `${level * 20}px` }}>
            {level > 0 && "-- "}
            {row.label}
          </span>
        </td>
        <td className="px-4 py-2 text-right">{row.value.toFixed(2)}</td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="w-[90%] mx-auto px-2  py-1 border rounded"
            placeholder="Enter value"
          />
        </td>
        <td className="px-4 py-2">
          <button
            onClick={() => handleAllocationClick(true)}
            className="px-3 py-1 mr-2 w-[90%] text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Allocation %
          </button>
        </td>
        <td className="px-4 py-2">
          <button
            onClick={() => handleAllocationClick(false)}
            className="px-3 py-1 w-[90%] text-white bg-green-500 rounded hover:bg-green-600"
          >
            Allocation Val
          </button>
        </td>
        <td className="px-4 py-2 text-right">
          {row.variance !== undefined ? `${row.variance}%` : "0%"}
        </td>
      </tr>
      {row.children?.map((child) => (
        <TableRowComponent
          key={child.id}
          row={child}
          level={level + 1}
          onUpdateValue={onUpdateValue}
        />
      ))}
    </>
  );
}
