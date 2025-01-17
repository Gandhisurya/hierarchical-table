export const calculateVariance = (
  current: number,
  original: number
): number => {
  if (original === 0) return 0;
  return Number((((current - original) / original) * 100).toFixed(2));
};

export const calculateSubtotals = (rows: any[]): any[] => {
  return rows.map((row) => {
    if (row.children) {
      const children = calculateSubtotals(row.children);
      const subtotal = children.reduce((sum, child) => sum + child.value, 0);
      return {
        ...row,
        children,
        value: subtotal,
        variance: calculateVariance(subtotal, row.originalValue || subtotal),
      };
    }
    return {
      ...row,
      variance: calculateVariance(row.value, row.originalValue || row.value),
    };
  });
};

export const distributeToChildren = (row: any, newValue: number): any => {
  if (!row.children) return row;

  const totalChildValue = row.children.reduce(
    (sum: number, child: any) => sum + child.value,
    0
  );
  const ratio = newValue / totalChildValue;

  return {
    ...row,
    value: newValue,
    variance: calculateVariance(newValue, row.originalValue || newValue),
    children: row.children.map((child: any) => ({
      ...child,
      value: Number((child.value * ratio).toFixed(2)),
      variance: calculateVariance(
        Number((child.value * ratio).toFixed(2)),
        child.originalValue || child.value
      ),
    })),
  };
};
