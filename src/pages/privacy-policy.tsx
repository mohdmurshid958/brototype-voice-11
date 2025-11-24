import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
              <p className="text-muted-foreground mt-2">Last updated: January 2025</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Brototype Complaint Portal, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use this portal.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                This portal is exclusively for Brototype students and authorized administrators. By registering, you confirm that you are a legitimate member of the Brototype community and will use the portal in accordance with these terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">As a user of this portal, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information in your complaints</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the portal only for its intended purpose of submitting legitimate complaints</li>
                <li>Respect other users and administrators in all communications</li>
                <li>Not submit spam, false, or malicious content</li>
                <li>Not attempt to access unauthorized areas or data</li>
                <li>Report any security vulnerabilities to administrators</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Complaint Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Valid Complaints</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complaints should be legitimate concerns related to Brototype facilities, services, or programs. Each complaint must include a clear description and appropriate category.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Prohibited Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may not submit content that is defamatory, harassing, threatening, discriminatory, or otherwise inappropriate. We reserve the right to remove any content that violates these guidelines.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Complaint Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We strive to review and respond to all complaints in a timely manner, typically within 24-48 hours. However, we do not guarantee specific resolution times, as each complaint is unique and may require different levels of investigation and action.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Complaint status updates will be provided through the portal. Students are responsible for checking their complaint status regularly.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                All content on this portal, including but not limited to text, graphics, logos, and software, is the property of Brototype or its licensors and is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute any content without explicit permission.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Your use of this portal is also governed by our Privacy Policy. We collect and process personal data in accordance with applicable data protection laws. Please review our Privacy Policy to understand how we handle your information.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your access to the portal at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The portal is provided "as is" without warranties of any kind. Brototype shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the portal.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the portal after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kerala.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact the Brototype administration through the complaint portal or at our official communication channels.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
