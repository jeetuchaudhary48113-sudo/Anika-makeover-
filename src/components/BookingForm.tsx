import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { ServiceCategory } from '../types';
import { addAppointmentToDb } from '../firebase';

interface BookingFormProps {
  services: ServiceCategory[];
  preSelectedService?: string;
  onSuccess?: () => void;
}

export default function BookingForm({ services, preSelectedService = '', onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    service: preSelectedService || '',
    date: '',
    time: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Flatten services list for selection
  const flatServices = services.flatMap(category => 
    category.services.map(srv => ({
      name: srv.title,
      category: category.category
    }))
  );

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Please enter your beautiful name';
    if (!formData.mobile.trim()) {
      tempErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[0-9]{10,14}$/.test(formData.mobile.replace(/[\s-]/g, ''))) {
      tempErrors.mobile = 'Please enter a valid mobile number';
    }
    if (!formData.service) tempErrors.service = 'Please select a service';
    if (!formData.date) tempErrors.date = 'Please choose your preferred date';
    if (!formData.time) tempErrors.time = 'Please pick a convenient time';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Real database write to appointments collection
      const newApptId = await addAppointmentToDb({
        name: formData.name.trim(),
        phone: formData.mobile.trim(),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.message.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      });

      // Set successful state only after confirm write completes
      setSuccessId(newApptId);

      // 2. Format Whatsapp message
      const messageText = `Hello Anika Makeover Salon,

Appointment Request (ID: ${newApptId})

Name: ${formData.name.trim()}
Mobile Number: ${formData.mobile.trim()}
Service Required: ${formData.service}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time}
Message: ${formData.message.trim() || 'N/A'}

Please confirm my appointment.

Thank You.`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/918922933940?text=${encodedMessage}`;

      // Open WhatsApp for instant salon notification integration
      window.open(whatsappUrl, '_blank', 'noreferrerPolicy=no-referrer');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error reserving appointment:', err);
      setErrorMsg('Failed to save reservation to cloud. Please review fields and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div id="booking-success-receipt" className="glass-premium p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden max-w-xl mx-auto border border-emerald-500/30 text-center animate-fade-in font-sans">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-gold/5 rounded-full blur-2xl -ml-16 -mb-16" />
        
        <div className="relative py-6 flex flex-col items-center">
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full w-20 h-20 mb-4 flex items-center justify-center shadow-lg">
            <CheckCircle2 size={44} className="animate-bounce-slow" />
          </div>
          
          <span className="font-sub-luxury text-emerald-600 font-semibold tracking-wider text-xs uppercase mb-1">Reservation Confirmed</span>
          <h3 className="font-serif-luxury text-2xl text-luxury-text font-bold mb-2">Thank You, {formData.name}!</h3>
          
          <div className="w-full bg-white/60 border border-neutral-100 rounded-2xl p-4 my-4 text-left text-xs space-y-2 font-sans relative">
            <div className="flex justify-between border-b border-neutral-100 pb-2 mb-2 font-semibold">
              <span className="text-gray-400">FIRESTORE RECORD ID</span>
              <span className="text-emerald-700 font-mono select-all bg-emerald-50 px-1.5 py-0.5 rounded font-bold">{successId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Chosen Service:</span>
              <span className="text-luxury-text font-semibold">{formData.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reserved Date:</span>
              <span className="text-luxury-text font-semibold">{formData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Convenient Slot:</span>
              <span className="text-luxury-text font-semibold">{formData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending Confirmation</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
            Your booking details are successfully saved into our cloud database. Make sure to present your Booking ID on date of arrival.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <a
              href={`https://wa.me/918922933940?text=${encodeURIComponent(`Hello, I booked an appointment. My Booking ID is ${successId}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-[#a15a64] text-white font-btn font-bold uppercase tracking-wider rounded-xl text-xs transition-transform hover:scale-[1.01] flex items-center justify-center space-x-2 shadow cursor-pointer text-center"
            >
              <MessageSquare size={14} />
              <span>Message Salon</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSuccessId(null);
                setFormData({
                  name: '',
                  mobile: '',
                  service: preSelectedService || '',
                  date: '',
                  time: '',
                  message: ''
                });
              }}
              className="py-3 px-5 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/5 font-btn font-bold uppercase tracking-wider rounded-xl text-xs cursor-pointer"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="booking-form-card" className="glass-premium p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden max-w-xl mx-auto border border-primary-gold/20">
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/5 rounded-full blur-2xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -ml-16 -mb-16" />

      <div className="relative text-center mb-6">
        <span className="font-sub-luxury text-primary-gold font-semibold tracking-wider text-sm uppercase block mb-1">Reservation</span>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-luxury-text font-bold mb-2">Book Appointment</h3>
        <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto">
          Schedule your pampering session. We will immediately redirect you to WhatsApp to instantly confirm your premium slot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Full Name *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-gold pointer-events-none">
              <User size={16} />
            </span>
            <input
              type="text"
              placeholder="e.g. Priyanshi Verma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-white/80 border rounded-xl font-sans text-sm focus:outline-none transition-all duration-300 ${
                errors.name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-primary-gold/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold'
              }`}
            />
          </div>
          {errors.name && <span className="text-red-500 text-[11px] mt-1 block font-sans font-medium">{errors.name}</span>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Mobile Number *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-gold pointer-events-none">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              placeholder="e.g. 08922933940 or +91 89229 33940"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-white/80 border rounded-xl font-sans text-sm focus:outline-none transition-all duration-300 ${
                errors.mobile ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-primary-gold/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold'
              }`}
            />
          </div>
          {errors.mobile && <span className="text-red-500 text-[11px] mt-1 block font-sans font-medium">{errors.mobile}</span>}
        </div>

        {/* Service Option */}
        <div>
          <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Service Required *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-gold pointer-events-none">
              <Sparkles size={16} />
            </span>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className={`w-full pl-10 pr-8 py-3 bg-white/80 border rounded-xl font-sans text-sm tracking-wide focus:outline-none appearance-none transition-all duration-300 ${
                errors.service ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-primary-gold/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold'
              }`}
            >
              <option value="">-- Choose Spa, Hair, Makeup or Bridal --</option>
              {services.map((cat) => (
                <optgroup key={cat.category} label={cat.category} className="font-semibold text-primary-gold">
                  {cat.services.map((srv) => (
                    <option key={srv.id} value={srv.title} className="text-luxury-text font-normal">
                      {srv.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none font-sans text-xs">▼</span>
          </div>
          {errors.service && <span className="text-red-500 text-[11px] mt-1 block font-sans font-medium">{errors.service}</span>}
        </div>

        {/* Date and Time Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Preferred Date *</label>
            <div className="relative font-sans">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-gold pointer-events-none">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-white/80 border rounded-xl font-sans text-sm focus:outline-none transition-all duration-300 ${
                  errors.date ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-primary-gold/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold'
                }`}
              />
            </div>
            {errors.date && <span className="text-red-500 text-[11px] mt-1 block font-sans font-medium">{errors.date}</span>}
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Preferred Time *</label>
            <div className="relative font-sans">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-gold pointer-events-none">
                <Clock size={16} />
              </span>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full pl-10 pr-8 py-3 bg-white/80 border rounded-xl font-sans text-sm focus:outline-none appearance-none transition-all duration-300 ${
                  errors.time ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-primary-gold/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold'
                }`}
              >
                <option value="">-- Choose Slot --</option>
                <option value="10:00 AM">10:00 AM (Opening Slot)</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM (Late slot)</option>
                <option value="07:00 PM">07:00 PM (Closing Slot)</option>
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none font-sans text-xs">▼</span>
            </div>
            {errors.time && <span className="text-red-500 text-[11px] mt-1 block font-sans font-medium">{errors.time}</span>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-btn text-gray-700 font-semibold mb-1 uppercase tracking-wider">Custom Message (Optional)</label>
          <div className="relative">
            <span className="absolute top-3 left-3.5 text-primary-gold pointer-events-none">
              <MessageSquare size={16} />
            </span>
            <textarea
              placeholder="e.g. I want to add heavy false eyelashes and traditional gold jewelry matching. Let me know details."
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/80 border border-primary-gold/20 rounded-xl font-sans text-sm focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 mt-2 bg-gradient-to-r from-primary-gold to-[#a15a64] text-white font-btn font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-primary-gold/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <MessageSquare size={18} className="animate-pulse" />
          <span>{isSubmitting ? 'Redirecting...' : 'Book via WhatsApp'}</span>
        </button>

        {/* Reassurance text */}
        <p className="text-[11px] font-sans text-gray-400 text-center mt-3">
          🔒 Secure & direct: Your personal booking records are preserved and forwarded right away.
        </p>
      </form>
    </div>
  );
}
