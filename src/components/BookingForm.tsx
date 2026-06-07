import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { ServiceCategory } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Context format matching customer's prompt
    const messageText = `Hello Anika Makeover Salon,

Appointment Request

Name: ${formData.name.trim()}
Mobile Number: ${formData.mobile.trim()}
Service Required: ${formData.service}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time}
Message: ${formData.message.trim() || 'N/A'}

Please confirm my appointment.

Thank You.`;

    // Encode the query parameters
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/918922933940?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noreferrerPolicy=no-referrer');
    
    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess();
    }
  };

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
