import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Payment = () => {
    const { state } = useLocation();
    const total = state?.total || 0;
    const navigate = useNavigate();

    const [cardType, setCardType] = useState('visa');
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState(null);

    useEffect(() => {
        const fetchSavedCards = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/cards/customer', { withCredentials: true });
                setSavedCards(res.data.cards || []);
            } catch (err) {
                console.error('Failed to fetch saved cards:', err);
            }
        };
        fetchSavedCards();
    }, []);

    const handleCardNumberChange = (e) => {
        let input = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let input = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (input.length > 2) {
            input = input.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        setExpiry(input);
    };

    const handleCvvChange = (e) => {
        const input = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvv(input);
    };

    const handleSavedCardPayment = async (card) => {
        setSelectedCardId(card._id);

        const { isConfirmed } = await Swal.fire({
            title: 'Use saved card?',
            html: `<b>${card.cardType.toUpperCase()}</b> **** ${card.cardNumber.slice(-4)}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Pay LKR ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`,
            confirmButtonColor: '#28a745',
            cancelButtonText: 'Cancel',
        });

        if (isConfirmed) {
            try {
                setIsPaying(true);
                await axios.post('http://localhost:5000/api/orders/place', {}, { withCredentials: true });

                await Swal.fire('Success!', 'Order placed successfully using saved card.', 'success');
                navigate('/customer/orders');
            } catch (error) {
                console.error('Payment error:', error);
                Swal.fire('Error', 'Failed to place order.', 'error');
            } finally {
                setIsPaying(false);
            }
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsPaying(true);

        try {
            await axios.post('http://localhost:5000/api/orders/place', {}, { withCredentials: true });

            const { isConfirmed } = await Swal.fire({
                title: 'Order placed successfully!',
                text: 'Do you want to save your card details for future use?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Save Card',
                cancelButtonText: 'No, Thanks',
            });

            if (isConfirmed) {
                try {
                    await axios.post('http://localhost:5000/api/cards/save', {
                        cardType,
                        cardHolder,
                        cardNumber: cardNumber.replace(/\s/g, ''),
                        expiry,
                        cvv
                    }, { withCredentials: true });

                    Swal.fire('Saved!', 'Card saved successfully.', 'success');

                    const res = await axios.get('http://localhost:5000/api/cards/customer', { withCredentials: true });
                    setSavedCards(res.data.cards || []);
                } catch (err) {
                    console.error('Card save error:', err);
                    Swal.fire('Failed', 'Could not save card.', 'error');
                }
            }

            navigate('/customer/orders');
        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire('Error', 'Failed to place order.', 'error');
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center gap-5">
                {/* Form Section */}
                <div className="col-lg-6">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h4 className="text-center mb-4">Card Payment</h4>

                            {/* Card Type */}
                            <div className="mb-4">
                                <p className="fw-bold mb-2">Select Card Type</p>
                                <div className="d-flex gap-4">
                                    <div className="form-check d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="radio"
                                            id="visa"
                                            name="cardType"
                                            value="visa"
                                            checked={cardType === 'visa'}
                                            onChange={() => setCardType('visa')}
                                        />
                                        <label className="form-check-label d-flex align-items-center" htmlFor="visa">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" width="40" className="me-2" />
                                            Visa Debit
                                        </label>
                                    </div>
                                    <div className="form-check d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="radio"
                                            id="mastercard"
                                            name="cardType"
                                            value="mastercard"
                                            checked={cardType === 'mastercard'}
                                            onChange={() => setCardType('mastercard')}
                                        />
                                        <label className="form-check-label d-flex align-items-center" htmlFor="mastercard">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" width="40" className="me-2" />
                                            Mastercard Credit
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePayment}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cardHolder"
                                        placeholder="Card Holder Name"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="cardHolder">Card Holder Name</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        required
                                    />
                                    <label htmlFor="cardNumber">Card Number</label>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="expiry"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                                required
                                            />
                                            <label htmlFor="expiry">MM/YY</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="cvv"
                                                placeholder="123"
                                                value={cvv}
                                                onChange={handleCvvChange}
                                                required
                                            />
                                            <label htmlFor="cvv">CVV</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end mb-3">
                                    <h5>Total: <span className="text-success">LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></h5>
                                </div>

                                <button type="submit" className="btn btn-success w-100" disabled={isPaying}>
                                    {isPaying ? 'Processing Payment...' : 'Pay Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
                        Your payment is encrypted and 100% secure.
                    </p>
                </div>

                {/* Saved Cards Section */}
                <div className="col-lg-4 mt-4 mt-lg-0">
                    <h5>Saved Cards</h5>
                    <div className="card shadow-sm p-3">
                        {savedCards.length === 0 ? (
                            <div className="d-flex flex-column align-items-center justify-content-center text-center py-4 text-muted" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3820/3820333.png"
                                    alt="No Cards"
                                    width="60"
                                    className="mb-3"
                                    style={{ opacity: 0.6 }}
                                />
                                <h6 className="mb-1">No Saved Cards</h6>
                                <p style={{ fontSize: '0.9rem' }}>You haven’t saved any card details yet.<br />Pay with a new card and choose to save it for next time!</p>
                            </div>
                        ) : (
                            savedCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`border rounded p-3 mb-2 d-flex align-items-center gap-3 ${selectedCardId === card._id ? 'border-primary border-2' : ''}`}
                                    style={{ cursor: 'pointer', backgroundColor: selectedCardId === card._id ? '#f0f8ff' : '' }}
                                    onClick={() => handleSavedCardPayment(card)}
                                >
                                    <img
                                        src={
                                            card.cardType === 'visa'
                                                ? 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png'
                                                : 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png'
                                        }
                                        alt={card.cardType}
                                        width="40"
                                    />
                                    <div>
                                        <div className="fw-semibold">{card.cardType.toUpperCase()} **** {card.cardNumber.slice(-4)}</div>
                                        <div className="text-muted">Expired on {card.expiry}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
