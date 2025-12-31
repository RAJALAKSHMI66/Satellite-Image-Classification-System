import React, { useState } from 'react';
import { Book, MessageCircle, Video, FileText, ChevronDown, ExternalLink, Search } from 'lucide-react';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I upload satellite images for classification?',
      answer: 'Navigate to the Dashboard and use the image upload area. You can drag and drop images or click to browse. Supported formats include PNG, JPG, and TIFF. Maximum file size is 10MB.',
    },
    {
      question: 'What types of land cover can the model classify?',
      answer: 'Our model can classify 5 main categories: Forest, Urban, Water, Agricultural, and Desert. Each classification comes with a confidence score indicating the model\'s certainty.',
    },
    {
      question: 'How accurate is the classification model?',
      answer: 'Our EfficientNet-B4 based model achieves 94.2% accuracy on the test dataset. Performance may vary depending on image quality and resolution.',
    },
    {
      question: 'Can I use my own trained models?',
      answer: 'Yes! You can upload custom models in the Model Architecture section. Supported formats include TensorFlow SavedModel, ONNX, and PyTorch state dictionaries.',
    },
    {
      question: 'How do I interpret the confusion matrix?',
      answer: 'The confusion matrix shows the relationship between predicted and actual classes. Diagonal values represent correct predictions, while off-diagonal values indicate misclassifications.',
    },
  ];

  const resources = [
    { title: 'Getting Started Guide', icon: Book, description: 'Learn the basics of satellite classification' },
    { title: 'Video Tutorials', icon: Video, description: 'Step-by-step visual guides' },
    { title: 'API Documentation', icon: FileText, description: 'Integrate with your applications' },
    { title: 'Community Forum', icon: MessageCircle, description: 'Connect with other users' },
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Documentation</h1>
        <p className="text-muted-foreground">Find answers and learn how to use SatelliteAI</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Resources</h2>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <button
                key={index}
                className="w-full glass-card rounded-xl p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <resource.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {resource.title}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Contact Support */}
          <div className="glass-card rounded-xl p-6 mt-6">
            <h3 className="font-semibold text-foreground mb-2">Need more help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist you.
            </p>
            <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
