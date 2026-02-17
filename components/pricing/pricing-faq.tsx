export function PricingFAQ() {
  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time from your dashboard. Prorated charges will apply automatically.',
    },
    {
      question: 'What happens if I hit my limit?',
      answer: 'We\'ll notify you via email when you reach 80% and 100% of your review limit. Analysis will pause until the next cycle or upgrade.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, the Starter and Growth plans come with a 14-day free trial. No credit card required to start testing with the Free plan.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans if you\'re not satisfied with the results.',
    },
  ];

  return (
    <div className="my-20 border-t border-slate-200 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h4 className="font-bold text-lg text-slate-900 mb-2">{faq.question}</h4>
            <p className="text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
