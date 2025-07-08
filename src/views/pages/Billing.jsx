import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Box,
  TextField,
  Typography,
  Autocomplete,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';
import MainCard from 'components/cards/MainCard';
import DeleteIcon from '@mui/icons-material/Delete';
import useMemberListStore from 'store/useMemberListStore';
import useGstStore from 'store/useGstStore';
import useItemListStore from 'store/useItemListStore'

const members = [
  { member_code: 'MEM001', member_name: 'Amit', state: 'West Bengal' },
  { member_code: 'MEM002', member_name: 'Rohit', state: 'Maharashtra' },
  { member_code: 'MEM003', member_name: 'Priya', state: 'West Bengal' },
  { member_code: 'MEM004', member_name: 'Anjali', state: 'Delhi' }
];

const items = [
  { name: 'Wishky', rate: '500', barcode: '8902519500694' },
  { name: 'Rum', rate: '300', barcode: '89000724' },
  { name: 'Wishky', rate: '400', barcode: '8908005822691' },
  { name: 'Wishky', rate: '500', barcode: 'W2070594' },
  { name: 'Gin', rate: '400', barcode: '89000728' }
];

const today = new Date().toISOString().split('T')[0];
const [year, month, day] = today.split('-');
const formattedDate = `${day}-${month}-${year}`;
const isNumeric = (val) => /^(\d+)?(\.\d{0,2})?$/.test(val);

export default function Billing() {
  const [memberCode, setMemberCode] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const [billingList, setBillingList] = useState([]);

  const [taxableAmount, setTaxableAmount] = useState('');

  const [cgstOptions, setCgstOptions] = useState([]);
  const [sgstOptions, setSgstOptions] = useState([]);

  const [selectedCGST, setSelectedCGST] = useState(null);
  const [selectedSGST, setSelectedSGST] = useState(null);

  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');

  const [gstAmount, setGstAmount] = useState('');
  const [finalTotal, setFinalTotal] = useState('');

  const [lastEdited, setLastEdited] = useState(null); // 'cgst' or 'sgst'
  const { data, fetchData, status } = useMemberListStore();
  const { gstdata, fetchGstData, gststatus } = useGstStore();
  const { itemdata, fetchItemData, itemstatus } = useItemListStore();

  const [scannedValue, setScannedValue] = useState('');
  const [toggle, setToggle] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);

  // Item → Rate Autofill
  useEffect(() => {
    if (selectedItem) {
      setRate(selectedItem?.item_rate);
      if (quantity) {
        setQuantity(quantity + 1);
      } else {
        setQuantity(1);
      }
    }
  }, [selectedItem, toggle]);

  // Item billing calculation
  useEffect(() => {
    if (rate && quantity) {
      const amt = rate * quantity;
      setAmount(amt);
      const disc = discount ? parseFloat(discount) : 0;
      const total = amt - disc;
      setTotalAmount(total);
    }
  }, [rate, quantity, discount]);

  // CGST-SGST Sync
  useEffect(() => {
    if (lastEdited === 'cgst' && isNumeric(cgst)) {
      setSgst(cgst);
    } else if (lastEdited === 'sgst' && isNumeric(sgst)) {
      setCgst(sgst);
    }
  }, [cgst, sgst, lastEdited]);

  // Taxable Amount from item list
  useEffect(() => {
    const sum = billingList.reduce((acc, item) => acc + item.total, 0);
    setTaxableAmount(sum.toFixed(2));
  }, [billingList]);

  // GST + Final Total calculation
  useEffect(() => {
    const gst =
      taxableAmount *
      ((Number(cgst || 0) + Number(sgst || 0)) / 100);
    setGstAmount(gst.toFixed(2));
    const final = Number(taxableAmount || 0) + gst;
    setFinalTotal(final.toFixed(2));
  }, [cgst, sgst, taxableAmount]);

  const handleAddItem = () => {
    console.log('clicked');

    if (selectedItem && quantity && isNumeric(quantity)) {
      console.log('entered');
      const rateVal = selectedItem.item_rate;
      const amt = rateVal * quantity;
      const disc = discount ? parseFloat(discount) : 0;
      const total = amt - disc;

      setBillingList(prev => {
        const index = prev.findIndex(
          item => item.name === selectedItem.item_name && item.rate === rateVal
        );

        if (index !== -1) {
          // Update existing item (merge quantities)
          const updatedList = [...prev];
          const existing = updatedList[index];

          const newQuantity = Number(existing.quantity) + Number(quantity);
          const newAmount = rateVal * newQuantity;
          const newDiscount = existing.discount + disc; // optionally add discounts
          const newTotal = newAmount - newDiscount;

          updatedList[index] = {
            ...existing,
            quantity: newQuantity,
            amount: newAmount,
            discount: newDiscount,
            total: newTotal
          };

          return updatedList;
        } else {
          // Add as new item
          return [
            ...prev,
            {
              name: selectedItem.item_name,
              quantity: Number(quantity),
              rate: rateVal,
              amount: amt,
              discount: disc,
              total
            }
          ];
        }
      });

      // Clear inputs
      setSelectedItem(null);
      setQuantity('');
      setRate('');
      setAmount('');
      setDiscount('');
      setTotalAmount('');
    }
  };


  const handleDeleteItem = (index) => {
    setBillingList(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!data && status === 'idle') fetchData();
  }, [data, fetchData, status]);

  useEffect(() => {
    if (!gstdata && gststatus === 'idle') fetchGstData();
  }, [gstdata, fetchGstData, gststatus]);

  useEffect(() => {
    if (!itemdata && itemstatus === 'idle') fetchItemData();
  }, [itemdata, fetchItemData, itemstatus]);

  useEffect(() => {
    // Ensure input is focused when component mounts
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setScannedValue(value);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Barcode scanning finished (after short delay)
      const trimmed = value.trim();
      const matchedItem = items.find((item) => item.barcode === trimmed);

      if (matchedItem && matchedItem != selectedItem) {
        console.log('Item changed, resetting quantity');
        if (buttonRef.current) buttonRef.current.click();
        setSelectedItem(matchedItem);
        setQuantity(''); // Reset quantity if item changes
      } else if (matchedItem) {
        setSelectedItem(matchedItem);
        setToggle(!toggle);
        console.log('✅ Matched:', matchedItem.name);
      } else {
        console.log('❌ No match for:', trimmed);
      }

      setScannedValue(''); // reset input for next scan
    }, 300); // Delay to detect end of barcode input
  };

  useEffect(() => {
    setCgstOptions(gstdata?.filter(item => item.gstType === 'CGST'));
    setSgstOptions(gstdata?.filter(item => item.gstType === 'SGST'));
  }, [gstdata]);

  const handleCGSTChange = (e, value) => {
    setSelectedCGST(value);
    setCgst(value?.rate || '');

    if (value) {
      const match = sgstOptions.find(item => item.rate === value.rate);
      setSelectedSGST(match || null);
      setSgst(match?.rate || '');
    } else {
      setSelectedSGST(null);
      setSgst('');
    }
  };

  const handleSGSTChange = (e, value) => {
    setSelectedSGST(value);
    setSgst(value?.rate || '');

    if (value) {
      const match = cgstOptions.find(item => item.rate === value.rate);
      setSelectedCGST(match || null);
      setCgst(match?.rate || '');
    } else {
      setSelectedCGST(null);
      setCgst('');
    }
  };

  return (
    <MainCard title='Billing Panel'>
      <Grid container spacing={3} >
        <Grid item size={{ xs: 12, md: 12 }}>
          {/* MEMBER DETAILS */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={3} display='flex' justifyContent='center' alignItems='center'>
              <Grid item size={{ xs: 12, md: 4.5 }}>
                <Autocomplete
                  options={data || []}
                  getOptionLabel={(opt) =>
                    opt?.member_code && opt?.member_name
                      ? `(${opt.member_code}) - (${opt.member_name})`
                      : ''
                  }
                  isOptionEqualToValue={(option, value) => option.member_id === value.member_id}
                  value={memberCode} // memberCode should be the full object
                  onChange={(e, value) => setMemberCode(value)}
                  size="small"
                  filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                      option.member_code?.toLowerCase().includes(inputValue.toLowerCase()) ||
                      option.member_name?.toLowerCase().includes(inputValue.toLowerCase())
                    )
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.member_id}>
                      ({option.member_code}) - ({option.member_name})
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="( Member Code ) - ( Member Name )" />
                  )}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />

              </Grid>
              <Grid item size={{ xs: 12, md: 4.5 }}>
                <TextField
                  label="Billing Date"
                  size="small"
                  value={formattedDate}
                  disabled
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>
              {/* <Grid item size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Scan barcode here"
                  inputRef={inputRef}
                  size="small"
                  value={scannedValue}
                  onChange={handleChange}
                  autoFocus
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid> */}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* MAIN LAYOUT: Billing Form + Summary + Item List */}
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 12 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Autocomplete
                  options={itemdata || []}
                  getOptionLabel={(opt) => opt.item_name || ''}
                  value={selectedItem}
                  onChange={(e, value) => {
                    setSelectedItem(value);
                    setQuantity('');
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField {...params} label="Item" />
                  )}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />

              </Grid>
              <Grid item size={{ xs: 12, md: 1.5 }}>
                <TextField
                  label="Rate"
                  size="small"
                  fullWidth
                  value={rate}
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 1 }}>
                <TextField
                  label="Qty"
                  size="small"
                  fullWidth
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || isNumeric(val)) setQuantity(val);
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 1.5 }}>
                <TextField
                  label="Amount"
                  size="small"
                  fullWidth
                  value={amount}
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 1.5 }}>
                <TextField
                  label="Discount"
                  size="small"
                  fullWidth
                  value={discount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || isNumeric(val)) setDiscount(val);
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12, md: 1.5 }}>
                <TextField
                  label="Total Amt"
                  size="small"
                  fullWidth
                  value={totalAmount}
                  disabled
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 1 }} display='flex' alignItems='center'>
                <Button
                  size='small'
                  variant="contained"
                  fullWidth
                  sx={{ background: 'linear-gradient(to right, #0e1a74, #bc0505, #50113e)', color: 'white' }}
                  onClick={handleAddItem}
                  ref={buttonRef}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid >

        <Grid item size={{ xs: 12, md: 12 }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {billingList.length === 0 ? (
              // <Typography variant="body2">No items added yet.</Typography>
              ''
            ) : (
              <TableContainer
                sx={{
                  maxHeight: 300,
                  overflow: 'auto',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '& th': {
                          fontWeight: 'bold',
                          backgroundColor: '#f5f5f5',
                          borderBottom: '1px solid #ddd',
                        },
                        '& th:first-of-type': {
                          borderTopLeftRadius: '12px',
                        },
                        '& th:last-of-type': {
                          borderTopRightRadius: '12px',
                        }
                      }}
                    >
                      <TableCell align="center" sx={{ width: '40px', padding: '4px' }}>#</TableCell>
                      <TableCell align='center'>Item</TableCell>
                      <TableCell align='center'>Qty</TableCell>
                      <TableCell align='center'>Rate</TableCell>
                      <TableCell align='center'>Discount</TableCell>
                      <TableCell align='right'>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billingList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" sx={{ width: '40px', padding: '4px' }}>
                          <Button
                            size="small"
                            color="error"
                            // variant="outlined"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                        <TableCell align='center'>{item.name}</TableCell>
                        <TableCell align='center'>
                          <TextField
                            placeholder='Qty'
                            size="small"
                            fullWidth
                            value={item.quantity}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '8px',
                                fontSize: '0.75rem'
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.75rem',
                              },
                              maxWidth: 40
                            }}
                            variant='standard'
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || isNumeric(val)) {
                                setBillingList(prev =>
                                  prev.map((item, i) => {
                                    if (i === index) {
                                      const quantity = Number(val || 0);
                                      const amount = quantity * item.rate;
                                      const discount = item.discount || 0;
                                      const total = amount - discount;

                                      return {
                                        ...item,
                                        quantity,
                                        amount,
                                        total,
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }
                            }}

                          />
                        </TableCell>
                        <TableCell align='center'>{item.rate}</TableCell>
                        <TableCell align='center'>
                          <TextField
                            placeholder='Disc'
                            size="small"
                            fullWidth
                            value={item.discount}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || isNumeric(val)) {
                                setBillingList(prev =>
                                  prev.map((item, i) => {
                                    if (i === index) {
                                      const discount = Number(val || 0);
                                      const amount = item.rate * item.quantity;
                                      const total = amount - discount;

                                      return {
                                        ...item,
                                        discount,
                                        amount,
                                        total,
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }
                            }}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '8px',
                                fontSize: '0.75rem'
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.75rem',
                              },
                              maxWidth: 50
                            }}
                            variant='standard'
                          />
                        </TableCell>
                        <TableCell align='right'><strong>{item.total}</strong></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Grid container spacing={2} mt={2} flexDirection='row-reverse'>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Grid container spacing={1}>
                  <Grid item size={{ xs: 12, md: 12 }} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h6" color="black">Taxable Amt:</Typography>
                    <Typography variant="h6" color="black">{taxableAmount}</Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }} >
                    <Grid container spacing={1} display='flex' justifyContent='space-between' alignItems='center'>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" color="black">CGST%:</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <Autocomplete
                          options={cgstOptions || []}
                          getOptionLabel={(opt) => opt?.gstDescription || ''}
                          value={selectedCGST}
                          onChange={handleCGSTChange}
                          renderInput={(params) => <TextField {...params} variant='standard' placeholder="Select CGST" />}
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option.gstDescription
                                ?.toLowerCase()
                                .includes(state.inputValue.toLowerCase())
                            )
                          }
                          size="small"
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px',
                              fontSize: '0.75rem'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="h6" color="black">{(gstAmount / 2).toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Grid container spacing={1} display='flex' justifyContent='space-between' alignItems='center' gap={1}>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" color="black">SGST%:</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <Autocomplete
                          options={sgstOptions || []}
                          getOptionLabel={(opt) => opt?.gstDescription || ''}
                          value={selectedSGST}
                          onChange={handleSGSTChange}
                          renderInput={(params) => <TextField {...params} placeholder="Select SGST" variant='standard' />}
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option.gstDescription
                                ?.toLowerCase()
                                .includes(state.inputValue.toLowerCase())
                            )
                          }
                          size="small"
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px',
                              fontSize: '0.75rem'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography variant="h6" color="black">{(gstAmount / 2).toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h6" color="black">Total GST Amt:</Typography>
                    <Typography variant="h6" color="black">{gstAmount}</Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h6" color="black">Net Amt:</Typography>
                    <Typography variant="h6" color="black">{finalTotal}</Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                      <Grid item size={{ xs: 4, md: 4 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size='small'
                          sx={{ background: '#bc0505', color: 'white' }}
                          onClick={() => {
                            setMemberCode(null);
                            setBillingList([]);
                            setTaxableAmount('');
                            setCgst('');
                            setSgst('');
                            setGstAmount('');
                            setFinalTotal('');
                            setSelectedItem(null);
                            setQuantity('');
                          }}
                        >
                          Clear All
                        </Button>
                      </Grid>
                      <Grid item size={{ xs: 4, md: 4 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ background: 'green', color: 'white' }}
                          size='small'
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* )} */}
      </Grid >
    </MainCard >
  );
}
