import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { columnSizeOptions, postTypes } from './options';
import {
  TbArrowLeft,
  TbArrowRight,
  TbCheck,
  TbChevronsLeft,
  TbChevronsRight,
  TbCopy,
  TbSearch,
  TbTrash,
  TbX,
} from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addColumn,
  deleteColumn,
  reorderColumn,
  updateColumn,
} from '@/services/api.service';
import { HashtagInput, SearchInput } from './Elements';

const CheckboxOption = ({ label, value, checked, onChange }) => {
  return (
    <div
      className={classNames('checkbox-option', {
        checked: checked,
      })}
      onClick={() => {
        onChange(value);
      }}
    >
      <label>{label}</label>
      <span className="checkbox">{checked && <TbCheck size={16} />}</span>
    </div>
  );
};

const CheckboxOptions = ({ options, onChange, isMultiple, value }) => {
  const [selectedValues, setSelectedValues] = useState(value);

  const handleCheckboxChange = (value) => {
    let updatedValues = [];
    if (isMultiple) {
      updatedValues = [...selectedValues, value];
    } else {
      updatedValues = value;
    }
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  return (
    <div className="checkbox-options">
      {options.map((option) => (
        <CheckboxOption
          key={option.value}
          label={option.label}
          value={option.value}
          checked={
            isMultiple
              ? selectedValues.includes(option.value)
              : selectedValues === option.value
          }
          onChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
};

export default function ColumnSettings({ column, onHide }) {
  const queryClient = useQueryClient();
  const updateColumnMutation = useMutation({
    mutationFn: (data) => updateColumn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (columnId) => deleteColumn(columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });

  const addColumnMutation = useMutation({
    mutationFn: (column) => addColumn(column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });

  const reorderColumnMutation = useMutation({
    mutationFn: ({ columnId, columnPosition }) =>
      reorderColumn(columnId, columnPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });

  const handleColumnSizeChange = (key) => (value) => {
    updateColumnMutation.mutate({
      columnId: column._id,
      update: {
        [key]: value,
      },
    });
  };

  const handleSettingUpdate = (key) => (value) => {
    updateColumnMutation.mutate({
      columnId: column._id,
      update: {
        [key]: value,
      },
    });
  };

  const handleDeleteColumn = () => {
    deleteColumnMutation.mutate(column._id);
  };

  const handleMoveColumnLeft = () => {
    reorderColumnMutation.mutate({
      columnId: column._id,
      columnPosition: column.columnPosition - 1,
    });
  };

  const handleMoveColumnRight = () => {
    reorderColumnMutation.mutate({
      columnId: column._id,
      columnPosition: column.columnPosition + 1,
    });
  };

  const handleCopyColumn = () => {
    const newColumn = { ...column };
    delete newColumn._id;
    addColumnMutation.mutate({
      column: {
        ...newColumn,
        columnPosition: column.columnPosition + 1,
      },
    });
  };

  const isPostFeed = column.feedType === 'posts';

  return (
    <div className="column-settings">
      <button className="close-icon" onClick={onHide}>
        <TbX size={20} />
      </button>
      {isPostFeed && (
        <div className="single-setting">
          <h4>Column Size</h4>
          <CheckboxOptions
            options={columnSizeOptions}
            key="column-size"
            onChange={handleColumnSizeChange('size')}
            isMultiple={false}
            value={column.size}
          />
        </div>
      )}

      {column.columnType === 'searchPosts' && (
        <div className="single-setting search-query">
          <h4>Search Query</h4>
          <SearchInput
            value={column.params?.query}
            onSearch={handleSettingUpdate('params.query')}
          />
        </div>
      )}

      {column.columnType === 'hashtagPosts' && (
        <div className="single-setting search-query">
          <h4>Hashtags</h4>
          <HashtagInput
            value={column.params?.tags}
            onChange={handleSettingUpdate('params.tags')}
          />
        </div>
      )}

      {isPostFeed && (
        <div className="single-setting">
          <h4>Post Type</h4>
          <CheckboxOptions
            options={postTypes}
            onChange={handleSettingUpdate('postTypes')}
          />
        </div>
      )}

      <div className="column-actions-list">
        {/* <div className="single-column-action" onClick={handleMoveColumnLeft}>
          <TbChevronsLeft size={20} />
          <div className="single-column-action-label">Move Left</div>
        </div>
        <div className="single-column-action" onClick={handleMoveColumnRight}>
          <TbChevronsRight size={20} />
          <div className="single-column-action-label">Move Right</div>
        </div> */}
        <div className="single-column-action" onClick={handleCopyColumn}>
          <TbCopy size={19} />
          <div className="single-column-action-label">Copy Column</div>
        </div>
        <div
          className="single-column-action delete-column"
          onClick={handleDeleteColumn}
        >
          <TbTrash size={19} />
          <div className="single-column-action-label">Delete Column</div>
        </div>
      </div>
    </div>
  );
}
