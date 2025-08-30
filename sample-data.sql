-- Sample data for Knowhere platform
-- Run this after setting up the main database schema

-- Insert sample profiles (these will be created automatically when users sign up with Clerk)
INSERT INTO profiles (id, username, full_name, bio, avatar_url) VALUES
('user_sample1', 'techwriter', 'Alex Chen', 'Full-stack developer and technical writer passionate about modern web technologies.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('user_sample2', 'designguru', 'Sarah Johnson', 'UX/UI designer with 8+ years of experience creating beautiful digital experiences.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('user_sample3', 'airesearcher', 'Dr. Michael Rodriguez', 'AI researcher and machine learning engineer exploring the future of artificial intelligence.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('user_sample4', 'startupfounder', 'Emma Wilson', 'Serial entrepreneur and startup advisor. Building the future one company at a time.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face');

-- Insert sample articles
INSERT INTO articles (id, title, subtitle, content, author_id, published, slug, read_time, tags, claps_count, comments_count) VALUES
('article_1', 
 'The Future of Web Development: What to Expect in 2024', 
 'Exploring the latest trends, frameworks, and technologies shaping the web development landscape.',
 '# The Future of Web Development: What to Expect in 2024

The web development landscape is evolving at an unprecedented pace. As we move through 2024, several key trends are reshaping how we build and interact with web applications.

## Server-Side Renaissance

The pendulum is swinging back towards server-side rendering, but with a modern twist. Frameworks like Next.js, Remix, and SvelteKit are leading the charge with their hybrid approaches that combine the best of both worlds.

### Key Benefits:
- **Improved SEO** - Search engines can easily crawl server-rendered content
- **Faster Initial Load** - Users see content immediately
- **Better Core Web Vitals** - Improved performance metrics

## The Rise of Edge Computing

Edge computing is no longer a buzzword—it''s becoming essential for modern web applications. By processing data closer to users, we can achieve:

- Reduced latency
- Improved user experience
- Better scalability
- Enhanced security

## AI Integration Everywhere

Artificial Intelligence is being woven into the fabric of web development:

```javascript
// AI-powered code completion
const generateComponent = async (description) => {
  const response = await ai.complete({
    prompt: `Create a React component: ${description}`,
    model: "gpt-4"
  });
  return response.code;
};
```

## WebAssembly Goes Mainstream

WebAssembly (WASM) is finally hitting its stride, enabling:
- High-performance applications in the browser
- Language diversity (Rust, Go, C++ in web apps)
- Better resource utilization

## Conclusion

The future of web development is bright, with technologies that prioritize performance, developer experience, and user satisfaction. Stay curious, keep learning, and embrace these exciting changes!

*What trends are you most excited about? Share your thoughts in the comments below.*',
 'user_sample1', 
 true, 
 'future-of-web-development-2024', 
 8, 
 ARRAY['web-development', 'technology', 'programming', 'future-tech'], 
 42, 
 7),

('article_2',
 'Designing for Accessibility: A Complete Guide',
 'Creating inclusive digital experiences that work for everyone, regardless of their abilities.',
 '# Designing for Accessibility: A Complete Guide

Accessibility isn''t just a nice-to-have feature—it''s a fundamental aspect of good design that benefits everyone. Let''s explore how to create truly inclusive digital experiences.

## Understanding Accessibility

Web accessibility means that websites, tools, and technologies are designed so that people with disabilities can use them effectively. This includes people with:

- **Visual impairments** (blindness, low vision, color blindness)
- **Hearing impairments** (deafness, hard of hearing)
- **Motor impairments** (limited fine motor control, paralysis)
- **Cognitive impairments** (dyslexia, autism, ADHD)

## The WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide a framework built on four principles:

### 1. Perceivable
Information must be presentable in ways users can perceive:
- Provide text alternatives for images
- Offer captions for videos
- Ensure sufficient color contrast
- Make content adaptable to different presentations

### 2. Operable
Interface components must be operable:
- Make all functionality keyboard accessible
- Give users enough time to read content
- Don''t use content that causes seizures
- Help users navigate and find content

### 3. Understandable
Information and UI operation must be understandable:
- Make text readable and understandable
- Make content appear and operate predictably
- Help users avoid and correct mistakes

### 4. Robust
Content must be robust enough for various assistive technologies:
- Maximize compatibility with current and future tools
- Use valid, semantic HTML
- Ensure content works across different browsers and devices

## Practical Implementation Tips

### Color and Contrast
```css
/* Ensure sufficient contrast ratios */
.text-primary {
  color: #1a1a1a; /* Dark text */
  background: #ffffff; /* Light background */
  /* Contrast ratio: 15.3:1 (exceeds WCAG AAA) */
}

.button-primary {
  background: #0066cc;
  color: #ffffff;
  /* Contrast ratio: 7.2:1 (exceeds WCAG AA) */
}
```

### Semantic HTML
Use proper HTML elements for their intended purpose:

```html
<!-- Good: Semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>
```

### Focus Management
Ensure keyboard navigation works smoothly:

```css
/* Visible focus indicators */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Skip links for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

## Testing Your Accessibility

### Automated Tools
- **axe-core**: Browser extension for automated testing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool

### Manual Testing
1. **Keyboard Navigation**: Tab through your entire interface
2. **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
3. **Color Blindness**: Use tools like Stark or ColorBrewer
4. **Zoom Testing**: Test at 200% zoom level

## The Business Case

Accessible design isn''t just ethical—it''s profitable:
- **Larger Market**: 15% of the global population has a disability
- **Better SEO**: Semantic HTML improves search rankings
- **Legal Compliance**: Avoid costly lawsuits
- **Improved UX**: Benefits all users, not just those with disabilities

## Conclusion

Accessibility should be considered from the very beginning of your design process, not bolted on as an afterthought. By following these guidelines and making accessibility a priority, you''ll create better experiences for everyone.

Remember: **Good accessibility is good design.**

*Have you implemented accessibility features in your projects? What challenges have you faced? Let''s discuss in the comments!*',
 'user_sample2',
 true,
 'designing-for-accessibility-complete-guide',
 12,
 ARRAY['accessibility', 'design', 'ux', 'web-design', 'inclusive-design'],
 38,
 12),

('article_3',
 'Machine Learning in Production: Lessons Learned',
 'Real-world insights from deploying ML models at scale, including common pitfalls and best practices.',
 '# Machine Learning in Production: Lessons Learned

After deploying dozens of machine learning models in production environments, I''ve learned that the journey from prototype to production is filled with unexpected challenges. Here are the key lessons that can save you time, money, and headaches.

## The 80/20 Rule of ML Projects

In most ML projects, you''ll spend:
- **20%** of your time on model development and training
- **80%** of your time on data engineering, deployment, monitoring, and maintenance

This ratio often surprises newcomers to the field who expect model building to be the main challenge.

## Data Quality is Everything

### The Garbage In, Garbage Out Principle

No amount of sophisticated algorithms can compensate for poor data quality. Common data issues include:

- **Missing values** that aren''t handled properly
- **Data drift** where production data differs from training data
- **Label noise** in supervised learning datasets
- **Sampling bias** that doesn''t represent the real-world distribution

### Implementing Data Validation

```python
import pandas as pd
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

def validate_data_quality(reference_data, current_data):
    """
    Validate data quality and detect drift
    """
    report = Report(metrics=[DataDriftPreset()])
    
    report.run(
        reference_data=reference_data,
        current_data=current_data,
        column_mapping=ColumnMapping()
    )
    
    return report.as_dict()

# Example usage
drift_report = validate_data_quality(train_data, production_data)
if drift_report[''metrics''][0][''result''][''dataset_drift'']:
    print("⚠️ Data drift detected! Model retraining recommended.")
```

## Model Versioning and Experiment Tracking

### The Importance of Reproducibility

Every model in production should be:
- **Versioned** with clear lineage
- **Reproducible** from code and data
- **Documented** with performance metrics
- **Traceable** back to training experiments

### MLOps Tools That Actually Work

After trying numerous tools, here''s what I recommend:

```yaml
# MLflow for experiment tracking
mlflow:
  tracking_uri: "postgresql://user:pass@localhost/mlflow"
  artifact_store: "s3://ml-artifacts-bucket"
  
# DVC for data versioning
dvc:
  remote: "s3://ml-data-bucket"
  cache: ".dvc/cache"

# Docker for containerization
docker:
  base_image: "python:3.9-slim"
  requirements: "requirements.txt"
```

## Monitoring and Alerting

### What to Monitor

1. **Model Performance Metrics**
   - Accuracy, precision, recall, F1-score
   - Business metrics (conversion rate, revenue impact)
   
2. **Data Quality Metrics**
   - Feature distributions
   - Missing value rates
   - Data freshness

3. **System Performance**
   - Latency (p50, p95, p99)
   - Throughput (requests per second)
   - Error rates

### Setting Up Effective Alerts

```python
# Example monitoring setup with Prometheus
from prometheus_client import Counter, Histogram, Gauge
import time

# Metrics
prediction_counter = Counter(''ml_predictions_total'', ''Total predictions made'')
prediction_latency = Histogram(''ml_prediction_duration_seconds'', ''Prediction latency'')
model_accuracy = Gauge(''ml_model_accuracy'', ''Current model accuracy'')

def make_prediction(features):
    start_time = time.time()
    
    try:
        prediction = model.predict(features)
        prediction_counter.inc()
        
        # Record latency
        prediction_latency.observe(time.time() - start_time)
        
        return prediction
        
    except Exception as e:
        # Log error and increment error counter
        logger.error(f"Prediction failed: {e}")
        raise
```

## Handling Model Drift

### Types of Drift

1. **Data Drift**: Input features change over time
2. **Concept Drift**: The relationship between features and target changes
3. **Label Drift**: The distribution of target values changes

### Automated Retraining Pipeline

```python
class ModelRetrainingPipeline:
    def __init__(self, drift_threshold=0.1):
        self.drift_threshold = drift_threshold
        
    def check_drift(self, reference_data, current_data):
        # Implement statistical tests for drift detection
        drift_score = self.calculate_drift_score(reference_data, current_data)
        return drift_score > self.drift_threshold
        
    def retrain_if_needed(self):
        if self.check_drift(self.reference_data, self.current_data):
            print("🔄 Drift detected. Starting retraining...")
            new_model = self.train_model(self.get_latest_data())
            
            if self.validate_model(new_model):
                self.deploy_model(new_model)
                print("✅ Model successfully retrained and deployed")
            else:
                print("❌ New model failed validation. Keeping current model.")
```

## A/B Testing for ML Models

### Gradual Rollout Strategy

Never deploy a new model to 100% of traffic immediately:

1. **Shadow Mode**: Run new model alongside old model, compare results
2. **Canary Deployment**: Route 5% of traffic to new model
3. **Gradual Rollout**: Increase to 25%, 50%, 75%, then 100%
4. **Rollback Plan**: Always have a way to quickly revert

```python
import random

def route_prediction_request(user_id, features):
    # Determine which model to use based on user_id
    if hash(user_id) % 100 < 10:  # 10% of users
        model = new_model
        model_version = "v2.1"
    else:
        model = current_model
        model_version = "v2.0"
    
    prediction = model.predict(features)
    
    # Log which model was used for analysis
    log_prediction(user_id, prediction, model_version)
    
    return prediction
```

## Cost Optimization

### Right-Sizing Your Infrastructure

- **CPU vs GPU**: Only use GPUs when necessary
- **Batch vs Real-time**: Batch processing is often 10x cheaper
- **Auto-scaling**: Scale down during low-traffic periods
- **Spot Instances**: Use for training workloads (can save 70%+)

### Model Optimization Techniques

```python
# Model quantization example
import torch

def optimize_model(model):
    # Quantize model to reduce size and improve inference speed
    quantized_model = torch.quantization.quantize_dynamic(
        model, 
        {torch.nn.Linear}, 
        dtype=torch.qint8
    )
    
    # Convert to TorchScript for production
    scripted_model = torch.jit.script(quantized_model)
    
    return scripted_model

# This can reduce model size by 4x and improve inference speed by 2-3x
```

## Key Takeaways

1. **Start Simple**: Begin with simple models and gradually increase complexity
2. **Invest in Infrastructure**: Good MLOps tooling pays for itself quickly
3. **Monitor Everything**: You can''t improve what you don''t measure
4. **Plan for Failure**: Models will fail; have rollback strategies ready
5. **Focus on Business Impact**: Technical metrics matter, but business outcomes matter more

## Common Pitfalls to Avoid

- **Over-engineering**: Don''t build a complex system for a simple problem
- **Ignoring Data Quality**: Clean data beats fancy algorithms
- **No Monitoring**: Silent failures are the worst kind of failures
- **Premature Optimization**: Get it working first, then make it fast
- **Vendor Lock-in**: Keep your options open with cloud providers

## Conclusion

Machine learning in production is as much about engineering as it is about data science. The most successful ML teams treat their models as products, with proper lifecycle management, monitoring, and continuous improvement.

The field is rapidly evolving, but these fundamental principles will serve you well regardless of which specific tools and technologies you choose.

*What challenges have you faced when deploying ML models? Share your experiences in the comments—we can all learn from each other''s successes and failures.*',
 'user_sample3',
 true,
 'machine-learning-production-lessons-learned',
 15,
 ARRAY['machine-learning', 'mlops', 'production', 'data-science', 'engineering'],
 67,
 23),

('article_4',
 'Building a Startup: From Idea to Series A',
 'A founder''s journey through the startup ecosystem, sharing insights on fundraising, team building, and scaling.',
 '# Building a Startup: From Idea to Series A

Two years ago, I was just another developer with an idea. Today, our startup has raised a Series A and is growing rapidly. Here''s the unfiltered story of what it really takes to build a successful startup.

## The Idea Phase: Solving Real Problems

### Finding Product-Market Fit

The biggest mistake I see founders make is falling in love with their solution instead of the problem. We went through three major pivots before finding our current direction.

**Original Idea**: A social network for developers
**Problem**: Developers already had GitHub, Stack Overflow, and Twitter
**Lesson**: Don''t build solutions looking for problems

**Second Iteration**: A code review tool
**Problem**: Market was saturated with existing solutions
**Lesson**: Timing and differentiation matter

**Final Pivot**: Developer productivity analytics
**Success**: Addressed a real pain point with a unique approach

### Validating Your Idea

Before writing a single line of code, we:

1. **Interviewed 100+ potential customers**
2. **Created landing pages to test demand**
3. **Built an MVP in 2 weeks**
4. **Got 10 paying customers before raising any money**

```javascript
// Our MVP was literally just a dashboard
const MVP = {
  features: [''Basic analytics'', ''Simple dashboard'', ''Email reports''],
  buildTime: ''2 weeks'',
  cost: ''$500 (mostly AWS)'',
  validation: ''10 paying customers''
};

// This taught us more than months of planning
```

## Team Building: Your Most Important Decision

### Hiring When You Can''t Compete on Salary

Early-stage startups can''t match big tech salaries, so you need to offer something else:

- **Equity**: Meaningful ownership in the company
- **Growth**: Rapid career advancement opportunities  
- **Impact**: Chance to shape the product and company
- **Learning**: Exposure to all aspects of the business

### Our Hiring Framework

We developed a simple framework for early hires:

```
HIRE = (Skill × Culture Fit × Growth Potential) / (Salary Expectations × Ego)
```

**Red Flags We Learned to Avoid:**
- Candidates who only ask about salary/benefits
- People who can''t explain complex topics simply
- Those who blame others for past failures
- Anyone who seems to think they''re "too good" for startup life

### Building Culture Early

Culture isn''t ping pong tables and free snacks. It''s:

- **Transparency**: We share revenue, metrics, and challenges with the entire team
- **Ownership**: Everyone has equity and acts like an owner
- **Learning**: We budget for conferences, courses, and books
- **Work-Life Balance**: Sustainable pace leads to better long-term results

## Fundraising: The Necessary Evil

### Pre-Seed: Friends, Family, and Fools

Our first $50K came from:
- Personal savings: $20K
- Friends and family: $15K  
- Angel investors: $15K

**Key Lesson**: Start fundraising before you need the money. It takes 3-6 months longer than you think.

### Seed Round: $500K

We raised our seed round based on:
- **Traction**: $10K MRR with strong growth
- **Team**: Strong technical and business backgrounds
- **Market Size**: $50B+ addressable market
- **Vision**: Clear path to $100M+ revenue

### Series A: $3M

The Series A was different. VCs cared about:
- **Unit Economics**: LTV/CAC ratio of 3:1 or better
- **Scalability**: Proven ability to grow efficiently
- **Competitive Moat**: Defensible advantages
- **Leadership Team**: Ability to scale to $100M+

### Fundraising Tips That Actually Work

1. **Tell a Story**: Numbers are important, but narrative drives decisions
2. **Show Momentum**: Growth rate matters more than absolute numbers
3. **Know Your Metrics**: Be able to explain every number in your deck
4. **Build Relationships Early**: Start talking to VCs 6 months before you need money
5. **Have a Plan B**: Always have 6+ months of runway

## Scaling Challenges

### From 0 to 10 Employees

The hardest part was letting go of control. As a founder, you''re used to doing everything. Scaling means:

- **Delegating**: Trust others to make decisions
- **Systematizing**: Document processes and procedures  
- **Communicating**: Over-communicate vision and priorities
- **Measuring**: Track what matters and ignore vanity metrics

### Technical Scaling

Our architecture evolved as we grew:

```
Stage 1 (0-1K users): Monolith on single server
Stage 2 (1K-10K users): Load balancer + database replica
Stage 3 (10K-100K users): Microservices + caching layer
Stage 4 (100K+ users): Multi-region deployment + CDN
```

**Key Principle**: Don''t over-engineer early, but plan for scale.

### Operational Scaling

We implemented systems for:
- **Customer Support**: Zendesk + knowledge base
- **Sales Process**: CRM + standardized demos
- **Marketing**: Content calendar + SEO strategy
- **Finance**: Proper accounting + monthly board reports

## Metrics That Matter

### Vanity Metrics vs. Actionable Metrics

**Vanity Metrics** (look good but don''t drive decisions):
- Total users
- Page views  
- Social media followers
- Press mentions

**Actionable Metrics** (drive business decisions):
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Net Promoter Score (NPS)

### Our Dashboard

```javascript
const keyMetrics = {
  mrr: 45000,           // Monthly Recurring Revenue
  growth: 0.15,         // 15% month-over-month growth
  cac: 150,             // Customer Acquisition Cost
  ltv: 2400,            // Lifetime Value
  churn: 0.05,          // 5% monthly churn
  nps: 42               // Net Promoter Score
};

// LTV/CAC ratio: 16:1 (healthy is 3:1+)
// Payback period: 10 months (good is <12 months)
```

## Mistakes We Made (And You Can Avoid)

### 1. Hiring Too Fast
We doubled our team in 3 months and nearly ran out of money. Growth should be sustainable.

### 2. Ignoring Unit Economics
We focused on growth without understanding profitability. Know your numbers.

### 3. Building Too Many Features
We tried to be everything to everyone. Focus is crucial.

### 4. Underestimating Sales Cycles
B2B sales take longer than you think. Plan accordingly.

### 5. Not Investing in Customer Success
Acquiring customers is expensive. Keeping them is profitable.

## The Reality of Startup Life

### The Emotional Rollercoaster

Startup life is intense:
- **Highs**: Closing big deals, successful launches, great press
- **Lows**: Losing key customers, failed fundraising, team conflicts
- **Reality**: Most days are somewhere in between

### Work-Life Balance

Despite what you hear, sustainable pace is important:
- **Set Boundaries**: Don''t work 80-hour weeks indefinitely
- **Take Breaks**: Burnout helps no one
- **Maintain Relationships**: Your personal life matters
- **Stay Healthy**: Exercise, sleep, and eat well

## Looking Forward

We''re now planning our Series B and have learned that each stage brings new challenges:

- **Series B**: Focus on market expansion and operational efficiency
- **Series C+**: International expansion and potential acquisitions
- **IPO/Exit**: Building a company that can stand on its own

## Key Takeaways

1. **Solve Real Problems**: Talk to customers constantly
2. **Build Great Teams**: Hire for culture fit and growth potential
3. **Focus on Metrics**: Measure what matters, ignore vanity metrics
4. **Raise Smart Money**: Choose investors who add value beyond capital
5. **Stay Resilient**: Startups are marathons, not sprints

## Final Thoughts

Building a startup is one of the hardest things you can do, but also one of the most rewarding. You''ll face rejection, setbacks, and moments of doubt. But if you''re solving a real problem with a great team, you have a chance to build something meaningful.

The startup ecosystem needs more diverse voices and perspectives. If you''re thinking about starting a company, the world needs what you''re building.

*Are you working on a startup? What challenges are you facing? Let''s connect and help each other succeed.*',
 'user_sample4',
 true,
 'building-startup-idea-to-series-a',
 18,
 ARRAY['startup', 'entrepreneurship', 'fundraising', 'business', 'leadership'],
 89,
 31);

-- Insert sample comments
INSERT INTO comments (article_id, user_id, content) VALUES
('article_1', 'user_sample2', 'Great insights on the server-side renaissance! I''ve been seeing this trend in my own projects. The hybrid approach really does give you the best of both worlds.'),
('article_1', 'user_sample3', 'The WebAssembly section is particularly interesting. We''ve been experimenting with WASM for some compute-heavy tasks and the performance gains are impressive.'),
('article_1', 'user_sample4', 'As someone building a startup in the web dev space, this article perfectly captures what we''re seeing in the market. Edge computing is definitely a game-changer.'),

('article_2', 'user_sample1', 'This is an excellent comprehensive guide! The code examples are particularly helpful. I''m bookmarking this for our team''s accessibility audit.'),
('article_2', 'user_sample3', 'The business case section really drives home why accessibility matters beyond just doing the right thing. Great point about the 15% market share.'),
('article_2', 'user_sample4', 'We implemented many of these practices in our startup and saw immediate improvements in user engagement. Accessibility really is good design.'),

('article_3', 'user_sample1', 'The 80/20 rule is so true! I spent months perfecting my model only to realize deployment was the real challenge. Wish I had read this earlier.'),
('article_3', 'user_sample2', 'The monitoring section is gold. We had a model silently failing in production for weeks before we noticed. Proper alerting is crucial.'),
('article_3', 'user_sample4', 'From a business perspective, the cost optimization tips are invaluable. ML infrastructure costs can spiral out of control quickly if you''re not careful.'),

('article_4', 'user_sample1', 'Inspiring story! The pivot examples really show how important it is to stay flexible and listen to the market.'),
('article_4', 'user_sample2', 'The hiring framework is brilliant. We''ve been struggling with early-stage hiring and this gives us a much better approach.'),
('article_4', 'user_sample3', 'The technical scaling section resonates with our experience. It''s tempting to over-engineer early, but starting simple is usually the right call.');

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
('user_sample1', 'user_sample2'),
('user_sample1', 'user_sample3'),
('user_sample2', 'user_sample1'),
('user_sample2', 'user_sample4'),
('user_sample3', 'user_sample1'),
('user_sample3', 'user_sample4'),
('user_sample4', 'user_sample2'),
('user_sample4', 'user_sample3');

-- Insert sample claps
INSERT INTO claps (user_id, article_id) VALUES
('user_sample1', 'article_2'),
('user_sample1', 'article_3'),
('user_sample1', 'article_4'),
('user_sample2', 'article_1'),
('user_sample2', 'article_3'),
('user_sample2', 'article_4'),
('user_sample3', 'article_1'),
('user_sample3', 'article_2'),
('user_sample3', 'article_4'),
('user_sample4', 'article_1'),
('user_sample4', 'article_2'),
('user_sample4', 'article_3');

-- Insert sample saved articles
INSERT INTO saved_articles (user_id, article_id) VALUES
('user_sample1', 'article_2'),
('user_sample1', 'article_4'),
('user_sample2', 'article_1'),
('user_sample2', 'article_3'),
('user_sample3', 'article_1'),
('user_sample3', 'article_4'),
('user_sample4', 'article_2'),
('user_sample4', 'article_3');
