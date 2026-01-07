import { useState } from 'react';
import { Stage } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Sparkles, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  stage: Stage;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ stage, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    // In production, this would integrate with Stripe
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-pink-600 flex items-center justify-center animate-pulse-glow">
            <Crown className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-display font-bold text-center mb-2">
          Unlock The Nexus
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          Access Stage 20 and the ultimate challenge!
        </p>

        {/* Stage preview */}
        <div className="glass-card bg-muted/50 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold">{stage.name}</h3>
              <p className="text-sm text-muted-foreground">Final Zone</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {stage.description}
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          {[
            'Access to The Nexus zone',
            'Exclusive story content',
            'Double rewards',
            'Permanent unlock',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-4xl font-display font-bold text-gradient-accent">
            1 €
          </span>
          <p className="text-sm text-muted-foreground">One-time payment</p>
        </div>

        {/* Payment button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className={cn(
            "w-full btn-game text-primary-foreground",
            "bg-gradient-to-r from-secondary to-pink-600"
          )}
          style={{
            boxShadow: '0 0 30px hsl(280 70% 55% / 0.4), 0 4px 0 hsl(280 70% 40%)'
          }}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Unlock for 1 €
            </span>
          )}
        </Button>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Secure payment via Stripe</span>
        </div>
      </div>
    </div>
  );
}
