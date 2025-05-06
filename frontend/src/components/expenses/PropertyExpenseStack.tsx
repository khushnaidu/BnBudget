import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Expense } from '../../types/expenseTypes';
import { ArrowUpward, ArrowDownward, RestartAlt } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Props {
  propertyName: string;
  expenses: Expense[];
  onDelete?: (id: number) => void;
  onView?: (expense: Expense) => void;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;

const PropertyExpenseStack: React.FC<Props> = ({
  propertyName,
  expenses,
  onDelete,
  onView,
}) => {
  const [index, setIndex] = useState(0);
  const expense = expenses[index];

  const atStart = index === 0;
  const atEnd = index === expenses.length - 1;

  const handleNext = () => {
    if (!atEnd) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (!atStart) setIndex(index - 1);
  };

  const handleReset = () => {
    setIndex(0);
  };

  return (
    <Box
      sx={{
        mx: 2,
        mb: 6,
        textAlign: 'center',
        width: CARD_WIDTH,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mb: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {propertyName}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          height: CARD_HEIGHT,
        }}
      >
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            padding: '16px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
              ${expense.amount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {expense.category} — Vendor: {expense.vendor || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {expense.expenseDate}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onView?.(expense)}
            >
              View
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onDelete?.(expense.id)}
            >
              Mark as Paid
            </Button>
          </Box>
        </motion.div>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 1 }}>
        <IconButton onClick={handlePrev} size="small" color="primary" disabled={atStart}>
          <ArrowUpward />
        </IconButton>
        <IconButton onClick={handleNext} size="small" color="primary" disabled={atEnd}>
          <ArrowDownward />
        </IconButton>
        {atEnd && (
          <IconButton onClick={handleReset} size="small" color="secondary">
            <RestartAlt />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default PropertyExpenseStack;
