import { useState, useEffect } from 'react';

// Course List (Update this list as needed)
const courseList = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biochemistry',
  'Physics',
  'Mathematics',
  'Business Administration',
  'Accounting',
];

// Bank List (Update this list as needed)
const bankList = [
  'Access Bank',
  'First Bank of Nigeria',
  'Guaranty Trust Bank (GTB)',
  'Zenith Bank',
  'United Bank for Africa (UBA)',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'Stanbic IBTC Bank',
  'Union Bank of Nigeria',
  'Wema Bank',
];

// AuthScreen Component for Login/Register
const AuthScreen = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    name: '', // For registration
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!authData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(authData.email)) newErrors.email = 'Email is invalid';
    if (!authData.password) newErrors.password = 'Password is required';
    if (!isLogin && !authData.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      if (isLogin) {
        onLogin(authData);
      } else {
        onRegister(authData);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 text-center font-semibold ${
            isLogin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 text-center font-semibold ${
            !isLogin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Register
        </button>
      </div>

      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={authData.name}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={authData.email}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={authData.password}
          onChange={handleChange}
          className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nameOfStudent: '',
    matricNumber: '',
    courseOfStudy: '',
    levelOfStudy: '',
    periodOfAttachmentFrom: '',
    periodOfAttachmentTo: '',
    placementOfAddress: '',
    bankCode: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    sortCode: '',
    siwesYear: '',
    studentEmailAddress: '',
    remarks: '',
  });
  const [errors, setErrors] = useState({});
  const [bankSearch, setBankSearch] = useState('');
  const [filteredBanks, setFilteredBanks] = useState(bankList);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock login function
  const handleLogin = (authData) => {
    console.log('Login:', authData);
    setIsLoggedIn(true);
    setStep(1); // Redirect to form after login
  };

  // Mock register function
  const handleRegister = (authData) => {
    console.log('Register:', authData);
    setIsLoggedIn(true);
    setStep(1); // Redirect to form after registration
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setStep(1); // Reset to initial state
    setFormData({
      nameOfStudent: '',
      matricNumber: '',
      courseOfStudy: '',
      levelOfStudy: '',
      periodOfAttachmentFrom: '',
      periodOfAttachmentTo: '',
      placementOfAddress: '',
      bankCode: '',
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      sortCode: '',
      siwesYear: '',
      studentEmailAddress: '',
      remarks: '',
    });
  };

  useEffect(() => {
    if (formData.accountNumber) {
      const firstBank = filteredBanks[0] || bankList[0];
      setFormData((prev) => ({ ...prev, bankName: firstBank }));
      setBankSearch(firstBank);

      const simulatedHolderName = `Holder-${formData.accountNumber.slice(-4)}`;
      setFormData((prev) => ({ ...prev, accountHolderName: simulatedHolderName }));
    } else {
      setFormData((prev) => ({ ...prev, bankName: '', accountHolderName: '' }));
      setBankSearch('');
      setFilteredBanks(bankList);
    }
  }, [formData.accountNumber, filteredBanks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });

    if (name === 'bankName') {
      setBankSearch(value);
      const filtered = bankList.filter((bank) =>
        bank.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBanks(filtered.length > 0 ? filtered : bankList);
      setShowDropdown(value.length > 0);
    }
  };

  const handleBankSelect = (bank) => {
    setFormData({ ...formData, bankName: bank });
    setBankSearch(bank);
    setFilteredBanks(bankList);
    setErrors({ ...errors, bankName: '' });
    setShowDropdown(false);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.nameOfStudent) newErrors.nameOfStudent = 'Name is required';
      if (!formData.matricNumber) newErrors.matricNumber = 'Matric Number is required';
      if (!formData.studentEmailAddress) newErrors.studentEmailAddress = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.studentEmailAddress)) newErrors.studentEmailAddress = 'Email is invalid';
    } else if (currentStep === 2) {
      if (!formData.courseOfStudy) newErrors.courseOfStudy = 'Course of Study is required';
      if (!formData.levelOfStudy) newErrors.levelOfStudy = 'Level of Study is required';
      if (!formData.siwesYear) newErrors.siwesYear = 'SIWES Year is required';
    } else if (currentStep === 3) {
      if (!formData.periodOfAttachmentFrom) newErrors.periodOfAttachmentFrom = 'Start date is required';
      if (!formData.periodOfAttachmentTo) newErrors.periodOfAttachmentTo = 'End date is required';
      if (!formData.placementOfAddress) newErrors.placementOfAddress = 'Placement Address is required';
      if (!formData.bankCode) newErrors.bankCode = 'Bank Code is required';
      if (!formData.bankName) newErrors.bankName = 'Bank Name is required';
      else if (!bankList.includes(formData.bankName)) newErrors.bankName = 'Please select a valid bank from the list';
      if (!formData.accountHolderName) newErrors.accountHolderName = 'Account Holder Name is required';
      if (!formData.accountNumber) newErrors.accountNumber = 'Account Number is required';
      if (!formData.sortCode) newErrors.sortCode = 'Sort Code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    setStep(5);
    console.log(formData);
    setTimeout(() => {
      setStep(6);
    }, 3000);
  };

  const StepIndicator = ({ currentStep, stepNumber, label }) => (
    <div className="flex flex-col items-center mx-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
        } mb-1`}
      >
        {currentStep > stepNumber ? '✓' : stepNumber}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
    </div>
  );

  const renderStep = () => {
    if (!isLoggedIn) {
      return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
    }

    switch (step) {
      case 1:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Basic Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name of Student</label>
              <input
                type="text"
                name="nameOfStudent"
                value={formData.nameOfStudent}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nameOfStudent ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.nameOfStudent && <p className="text-red-500 text-xs mt-1">{errors.nameOfStudent}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Matric Number</label>
              <input
                type="text"
                name="matricNumber"
                value={formData.matricNumber}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.matricNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.matricNumber && <p className="text-red-500 text-xs mt-1">{errors.matricNumber}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Student Email Address</label>
              <input
                type="email"
                name="studentEmailAddress"
                value={formData.studentEmailAddress}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.studentEmailAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.studentEmailAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.studentEmailAddress}</p>
              )}
            </div>
            <button
              onClick={nextStep}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Academic Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Course of Study</label>
              <select
                name="courseOfStudy"
                value={formData.courseOfStudy}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.courseOfStudy ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a course</option>
                {courseList.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {errors.courseOfStudy && <p className="text-red-500 text-xs mt-1">{errors.courseOfStudy}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Level of Study</label>
              <input
                type="text"
                name="levelOfStudy"
                value={formData.levelOfStudy}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.levelOfStudy ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.levelOfStudy && <p className="text-red-500 text-xs mt-1">{errors.levelOfStudy}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">SIWES Year</label>
              <input
                type="text"
                name="siwesYear"
                value={formData.siwesYear}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.siwesYear ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.siwesYear && <p className="text-red-500 text-xs mt-1">{errors.siwesYear}</p>}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                onClick={prevStep}
                className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition w-full sm:w-auto"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl sm: text-2xl font-bold mb-4 text-gray-800">Placement Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Period of Attachment (From)</label>
              <input
                type="date"
                name="periodOfAttachmentFrom"
                value={formData.periodOfAttachmentFrom}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.periodOfAttachmentFrom ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.periodOfAttachmentFrom && (
                <p className="text-red-500 text-xs mt-1">{errors.periodOfAttachmentFrom}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Period of Attachment (To)</label>
              <input
                type="date"
                name="periodOfAttachmentTo"
                value={formData.periodOfAttachmentTo}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.periodOfAttachmentTo ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.periodOfAttachmentTo && (
                <p className="text-red-500 text-xs mt-1">{errors.periodOfAttachmentTo}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Placement of Address</label>
              <input
                type="text"
                name="placementOfAddress"
                value={formData.placementOfAddress}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.placementOfAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.placementOfAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.placementOfAddress}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bank Code</label>
              <input
                type="text"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bankCode ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.bankCode && <p className="text-red-500 text-xs mt-1">{errors.bankCode}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={bankSearch}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Type to search or auto-filled from account number..."
                required
              />
              {showDropdown && bankSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredBanks.map((bank, index) => (
                    <div
                      key={index}
                      onClick={() => handleBankSelect(bank)}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {bank}
                    </div>
                  ))}
                </div>
              )}
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Auto-filled from account number..."
                readOnly
                required
              />
              {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Sort Code</label>
              <input
                type="text"
                name="sortCode"
                value={formData.sortCode}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sortCode ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.sortCode && <p className="text-red-500 text-xs mt-1">{errors.sortCode}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                rows="3"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                onClick={prevStep}
                className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition w-full sm:w-auto"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Review & Confirm</h2>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Basic Information</h3>
              <p className="text-gray-600">Name: {formData.nameOfStudent}</p>
              <p className="text-gray-600">Matric Number: {formData.matricNumber}</p>
              <p className="text-gray-600">Email: {formData.studentEmailAddress}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Academic Details</h3>
              <p className="text-gray-600">Course of Study: {formData.courseOfStudy}</p>
              <p className="text-gray-600">Level of Study: {formData.levelOfStudy}</p>
              <p className="text-gray-600">SIWES Year: {formData.siwesYear}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Placement Details</h3>
              <p className="text-gray-600">Period of Attachment (From): {formData.periodOfAttachmentFrom}</p>
              <p className="text-gray-600">Period of Attachment (To): {formData.periodOfAttachmentTo}</p>
              <p className="text-gray-600">Placement Address: {formData.placementOfAddress}</p>
              <p className="text-gray-600">Bank Code: {formData.bankCode}</p>
              <p className="text-gray-600">Account Number: {formData.accountNumber}</p>
              <p className="text-gray-600">Bank Name: {formData.bankName}</p>
              <p className="text-gray-600">Account Holder Name: {formData.accountHolderName}</p>
              <p className="text-gray-600">Sort Code: {formData.sortCode}</p>
              <p className="text-gray-600">Remarks: {formData.remarks || 'None'}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                onClick={prevStep}
                className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition w-full sm:w-auto"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
              >
                Submit
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative w-24 h-24 mb-4">
              <svg
                className="w-full h-full text-green-500 animate-drawCheckmark"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                viewBox="0 0 24 24"
              >
                <path
                  className="checkmark-path"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 animate-fadeIn">
              Form Submitted Successfully!
            </h2>
            <p className="text-gray-600 animate-fadeIn animation-delay-200">
              Your SIWES application has been submitted and is awaiting admin approval.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 animate-fadeIn">
              Approval Status
            </h2>
            <p className="text-gray-600 mb-6 animate-fadeIn animation-delay-200">
              Your application has been reviewed by the admin.
            </p>
            <div className="w-full max-w-2xl mx-auto animate-fadeIn animation-delay-400">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 text-left">Status: Approved</h3>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 text-left">Basic Information</h3>
                <p className="text-gray-600 text-left">Name: {formData.nameOfStudent}</p>
                <p className="text-gray-600 text-left">Matric Number: {formData.matricNumber}</p>
                <p className="text-gray-600 text-left">Email: {formData.studentEmailAddress}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 text-left">Academic Details</h3>
                <p className="text-gray-600 text-left">Course of Study: {formData.courseOfStudy}</p>
                <p className="text-gray-600 text-left">Level of Study: {formData.levelOfStudy}</p>
                <p className="text-gray-600 text-left">SIWES Year: {formData.siwesYear}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 text-left">Placement Details</h3>
                <p className="text-gray-600 text-left">Period of Attachment (From): {formData.periodOfAttachmentFrom}</p>
                <p className="text-gray-600 text-left">Period of Attachment (To): {formData.periodOfAttachmentTo}</p>
                <p className="text-gray-600 text-left">Placement Address: {formData.placementOfAddress}</p>
                <p className="text-gray-600 text-left">Bank Code: {formData.bankCode}</p>
                <p className="text-gray-600 text-left">Account Number: {formData.accountNumber}</p>
                <p className="text-gray-600 text-left">Bank Name: {formData.bankName}</p>
                <p className="text-gray-600 text-left">Account Holder Name: {formData.accountHolderName}</p>
                <p className="text-gray-600 text-left">Sort Code: {formData.sortCode}</p>
                <p className="text-gray-600 text-left">Remarks: {formData.remarks || 'None'}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3">
            <svg
              className="w-full h-full text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <text
                x="12"
                y="16"
                fontSize="12"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                S
              </text>
            </svg>
          </div>
          {/* Title */}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            SIWES Application Form
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setStep(0)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex items-start justify-center p-2 sm:p-4">
        <div className="w-full h-full bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col">
          {/* Horizontal Step Indicators (Hidden on Auth, Success, and Approval Screens) */}
          {isLoggedIn && step < 5 && (
            <div className="flex justify-center overflow-x-auto mb-4 sm:mb-6">
              <div className="flex space-x-2 sm:space-x-4">
                <StepIndicator currentStep={step} stepNumber={1} label="Basic Information" />
                <StepIndicator currentStep={step} stepNumber={2} label="Academic Details" />
                <StepIndicator currentStep={step} stepNumber={3} label="Placement Details" />
                <StepIndicator currentStep={step} stepNumber={4} label="Review & Confirm" />
              </div>
            </div>
          )}
          {/* Form Content */}
          <div className="flex-1">{renderStep()}</div>
        </div>
      </div>

      {/* Inline CSS for Animations */}
      <style>
        {`
          @keyframes drawCheckmark {
            0% { stroke-dasharray: 0, 30; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 30, 30; stroke-dashoffset: 0; }
            100% { stroke-dasharray: 30, 30; stroke-dashoffset: 0; }
          }
          .animate-drawCheckmark {
            stroke-dasharray: 30, 30;
            stroke-dashoffset: 0;
            animation: drawCheckmark 0.5s ease-in-out forwards;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
        `}
      </style>
    </div>
  );
}

export default App;