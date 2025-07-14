import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { requestOtp, verifyOtp, resetOtpState } from '@/store/slices/authSlice';
import { createDefaultChatrooms } from '@/store/slices/chatSlice';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Define the form schema for phone number
const phoneFormSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z
    .string()
    .min(5, 'Phone number must be at least 5 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

// Define the form schema for OTP
const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, otpSent, otpVerified } = useSelector((state: RootState) => state.auth);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    setValue: setPhoneValue,
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      countryCode: '+1', // Default to US
      phoneNumber: '',
    },
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
        const data = await response.json();

        const formattedCountries: Country[] = data
          .filter((country: any) => country.idd.root) // Filter out countries without dial codes
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            dial_code: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`,
            flag: country.flags.svg,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);

        // Set default selected country (US)
        const defaultCountry = formattedCountries.find((c) => c.code === 'IN');
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setPhoneValue('countryCode', defaultCountry.dial_code);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load country data');
      }
    };

    fetchCountries();
  }, [setPhoneValue]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle phone form submission
  const onPhoneSubmit = (data: PhoneFormValues) => {
    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      dispatch(requestOtp({ 
        phoneNumber: data.phoneNumber, 
        countryCode: data.countryCode 
      }));

      toast.success('OTP sent to your phone');
      setIsLoading(false);
    }, 1500);
  };

  // Handle OTP form submission
  const onOtpSubmit = (data: OtpFormValues) => {
    setIsLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      dispatch(verifyOtp());

      // Ensure default chats are initialized when user logs in
      if (typeof window !== 'undefined') {
        const storedChatrooms = localStorage.getItem('chatrooms');
        if (!storedChatrooms || JSON.parse(storedChatrooms).length === 0) {
          const defaultChatrooms = createDefaultChatrooms();
          localStorage.setItem('chatrooms', JSON.stringify(defaultChatrooms));
        }
      }

      toast.success('Login successful');
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  // Handle country selection
  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setPhoneValue('countryCode', country.dial_code);
    setShowCountryDropdown(false);
  };

  // Handle back button in OTP screen
  const handleBack = () => {
    dispatch(resetOtpState());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Gemini Chat</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
            {otpSent ? 'Enter the OTP sent to your phone' : 'Sign in with your phone number'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          {!otpSent ? (
            // Phone number form
            <form onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center justify-between w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      {selectedCountry ? (
                        <>
                          <div className="w-6 h-4 relative overflow-hidden rounded-sm">
                            {selectedCountry.flag && (
                              <Image
                                src={selectedCountry.flag}
                                alt={selectedCountry.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <span className="ml-2">{selectedCountry.dial_code}</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-64 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                        <input
                          type="text"
                          className="w-full p-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
                          placeholder="Search countries..."
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const filteredCountries = countries.filter(
                              (country) =>
                                country.name.toLowerCase().includes(searchTerm) ||
                                country.dial_code.includes(searchTerm)
                            );
                            // We don't need to update the state here as we're filtering on the fly
                          }}
                        />
                        <ul>
                          {countries.map((country) => (
                            <li
                              key={country.code}
                              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => selectCountry(country)}
                            >
                              <div className="w-6 h-4 relative overflow-hidden rounded-sm">
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <span className="ml-2 text-text-light dark:text-text-dark">
                                {country.name} ({country.dial_code})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    id="phoneNumber"
                    {...registerPhone('phoneNumber')}
                    className="flex-1 input rounded-l-none"
                    placeholder="Enter phone number"
                  />
                </div>
                <input type="hidden" {...registerPhone('countryCode')} />
                {phoneErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{phoneErrors.phoneNumber.message}</p>
                )}
                {phoneErrors.countryCode && (
                  <p className="mt-1 text-sm text-red-600">{phoneErrors.countryCode.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            // OTP verification form
            <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  One-Time Password
                </label>
                <input
                  type="text"
                  id="otp"
                  {...registerOtp('otp')}
                  className="input"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                {otpErrors.otp && (
                  <p className="mt-1 text-sm text-red-600">{otpErrors.otp.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  className="w-full btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  className="w-full btn btn-outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
