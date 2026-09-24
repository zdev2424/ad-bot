export const COUNTRY_PAYMENT_CONFIG = {
  KE: {
    countryName: 'Kenya',
    currency: 'KES (Kenyan Shilling)',
    symbol: 'KSh',
    methods: [
      {
        id: 'mpesa',
        name: 'M-Pesa (Safaricom)',
        icon: '📱',
        color: '#10B981',
        fields: [
          { name: 'phone', label: 'M-Pesa Phone Number', placeholder: '07XXXXXXXX or 01XXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Registered Full Name', placeholder: 'e.g. John Kamau', type: 'text', required: true }
        ]
      },
      {
        id: 'airtel_ke',
        name: 'Airtel Money Kenya',
        icon: '🔴',
        color: '#EF4444',
        fields: [
          { name: 'phone', label: 'Airtel Money Number', placeholder: '07XXXXXXXX or 01XXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Registered Full Name', placeholder: 'e.g. John Kamau', type: 'text', required: true }
        ]
      }
    ]
  },
  IN: {
    countryName: 'India',
    currency: 'INR (Indian Rupee)',
    symbol: '₹',
    methods: [
      {
        id: 'upi',
        name: 'UPI (GPay / PhonePe / Paytm)',
        icon: '⚡',
        color: '#06B6D4',
        fields: [
          { name: 'upiId', label: 'UPI ID / VPA', placeholder: 'e.g. 9876543210@paytm or name@okaxis', type: 'text', required: true },
          { name: 'fullName', label: 'Account Holder Name', placeholder: 'e.g. Rahul Sharma', type: 'text', required: true }
        ]
      },
      {
        id: 'imps_bank',
        name: 'Bank Transfer (IMPS / NEFT)',
        icon: '🏦',
        color: '#8B5CF6',
        fields: [
          { name: 'accountNumber', label: 'Bank Account Number', placeholder: 'e.g. 012345678901', type: 'text', required: true },
          { name: 'ifsc', label: 'IFSC Code', placeholder: 'e.g. HDFC0001234 / SBIN0001234', type: 'text', required: true },
          { name: 'fullName', label: 'Account Holder Name', placeholder: 'e.g. Rahul Sharma', type: 'text', required: true }
        ]
      }
    ]
  },
  ID: {
    countryName: 'Indonesia',
    currency: 'IDR (Indonesian Rupiah)',
    symbol: 'Rp',
    methods: [
      {
        id: 'dana',
        name: 'DANA E-Wallet',
        icon: '💳',
        color: '#0284C7',
        fields: [
          { name: 'phone', label: 'DANA Registered Phone Number', placeholder: '08XXXXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Registered Full Name', placeholder: 'e.g. Budi Santoso', type: 'text', required: true }
        ]
      },
      {
        id: 'gopay',
        name: 'GoPay / OVO',
        icon: '🟢',
        color: '#10B981',
        fields: [
          { name: 'phone', label: 'GoPay / OVO Phone Number', placeholder: '08XXXXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Registered Full Name', placeholder: 'e.g. Budi Santoso', type: 'text', required: true }
        ]
      }
    ]
  },
  ET: {
    countryName: 'Ethiopia',
    currency: 'ETB (Ethiopian Birr)',
    symbol: 'Br',
    methods: [
      {
        id: 'telebirr',
        name: 'Telebirr',
        icon: '📱',
        color: '#06B6D4',
        fields: [
          { name: 'phone', label: 'Telebirr Phone Number', placeholder: '09XXXXXXXX or 07XXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Abebe Bikila', type: 'text', required: true }
        ]
      },
      {
        id: 'cbe',
        name: 'CBE Bank (Commercial Bank)',
        icon: '🏦',
        color: '#8B5CF6',
        fields: [
          { name: 'accountNumber', label: 'CBE Account Number', placeholder: '1000XXXXXXXXX', type: 'text', required: true },
          { name: 'fullName', label: 'Account Holder Name', placeholder: 'e.g. Abebe Bikila', type: 'text', required: true }
        ]
      }
    ]
  },
  NG: {
    countryName: 'Nigeria',
    currency: 'NGN (Nigerian Naira)',
    symbol: '₦',
    methods: [
      {
        id: 'opay_palmpay',
        name: 'OPay / PalmPay',
        icon: '📱',
        color: '#10B981',
        fields: [
          { name: 'phone', label: 'Account / Phone Number', placeholder: '080XXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Account Name', placeholder: 'e.g. Emeka Okafor', type: 'text', required: true }
        ]
      },
      {
        id: 'ng_bank',
        name: 'Bank Transfer',
        icon: '🏦',
        color: '#8B5CF6',
        fields: [
          { name: 'bankName', label: 'Bank Name', placeholder: 'e.g. Access Bank, GTBank, Zenith', type: 'text', required: true },
          { name: 'accountNumber', label: 'Account Number', placeholder: '10-digit NUBAN Number', type: 'text', required: true },
          { name: 'fullName', label: 'Account Name', placeholder: 'e.g. Emeka Okafor', type: 'text', required: true }
        ]
      }
    ]
  },
  PH: {
    countryName: 'Philippines',
    currency: 'PHP (Philippine Peso)',
    symbol: '₱',
    methods: [
      {
        id: 'gcash',
        name: 'GCash',
        icon: '📱',
        color: '#0284C7',
        fields: [
          { name: 'phone', label: 'GCash Mobile Number', placeholder: '09XXXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Account Name', placeholder: 'e.g. Juan dela Cruz', type: 'text', required: true }
        ]
      },
      {
        id: 'maya',
        name: 'Maya (PayMaya)',
        icon: '🟢',
        color: '#10B981',
        fields: [
          { name: 'phone', label: 'Maya Mobile Number', placeholder: '09XXXXXXXXX', type: 'tel', required: true },
          { name: 'fullName', label: 'Account Name', placeholder: 'e.g. Juan dela Cruz', type: 'text', required: true }
        ]
      }
    ]
  }
};
