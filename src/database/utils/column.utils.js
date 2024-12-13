import Column from '../models/columnSchema';

export const createColumns = async (columns) => {
  const isArray = Array.isArray(columns);
  const userId = isArray ? columns[0].userId : columns.userId;
  const lastColumn = await Column.findOne({ userId }).sort({
    columnPosition: -1,
  });
  let lastPosition = lastColumn?.columnPosition ? lastColumn.columnPosition + 1 : 1;
  console.log('lastPosition', lastPosition);
  if (isArray) {
    let newColumns = [];
    for (let column of columns) {
      const newColData = {
        ...column,
        columnPosition: lastPosition || 1,
      };
      console.log('newColData', newColData);
      const newColumn = await Column.create(newColData);
      newColumns.push(newColumn);
      lastPosition++;
    }
    return newColumns;
  } else {
    const newColumn = await Column.create({
      ...columns,
      columnPosition: lastPosition || 2,
    });
    return newColumn;
  }
};
