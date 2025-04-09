import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const DebugPanel = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugOutput, setDebugOutput] = useState<string>("");
  const today = format(new Date(), "yyyy-MM-dd");

  const createDemoContent = async () => {
    setIsSubmitting(true);
    setDebugOutput("");

    try {
      // Create a blog post
      const blogData = {
        title: "How Meditation Changes Your Brain",
        content: `<p>Scientists have been studying the effects of meditation on the brain for decades, and the results are fascinating. Here's what they've discovered:</p>
        <h3>1. Increased Gray Matter</h3>
        <p>Regular meditation increases gray matter density in areas associated with memory, learning, and emotional regulation.</p>
        <h3>2. Reduced Stress Response</h3>
        <p>Meditation helps reduce activity in the amygdala, the brain's stress center, even when you're not actively meditating.</p>
        <h3>3. Improved Focus</h3>
        <p>Just 8 weeks of regular meditation can improve your ability to sustain attention and ignore distractions.</p>`,
        category: "Mindfulness",
        featured: true,
        publishedAt: new Date().toISOString()
      };

      const blogRes = await apiRequest("POST", "/api/blog-posts", blogData);
      const blogResponse = await blogRes.json();
      setDebugOutput(prev => prev + `Blog post creation result: ${JSON.stringify(blogResponse)}\n\n`);

      // Create horoscope for each sign
      const zodiacSigns = [
        "aries", "taurus", "gemini", "cancer", "leo", "virgo", 
        "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
      ];

      for (const sign of zodiacSigns) {
        const horoscopeData = {
          sign,
          content: `Today is a great day for ${sign}. You may find unexpected opportunities coming your way. Stay open to new experiences and trust your intuition.`,
          date: today
        };

        try {
          const horoscopeRes = await apiRequest("POST", "/api/horoscopes", horoscopeData);
          const horoscopeResponse = await horoscopeRes.json();
          setDebugOutput(prev => prev + `${sign} horoscope creation result: ${JSON.stringify(horoscopeResponse)}\n\n`);
        } catch (error) {
          setDebugOutput(prev => prev + `Error creating ${sign} horoscope: ${error}\n\n`);
        }
      }

      // Refresh all queries
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/horoscopes"] });

      toast({
        title: "Content Creation Complete",
        description: "Check the debug output for details",
      });
    } catch (error) {
      console.error("Error creating content:", error);
      setDebugOutput(prev => prev + `Error: ${error}\n\n`);
      toast({
        title: "Error",
        description: "Failed to create content. See debug output for details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Debug Panel</CardTitle>
        <CardDescription>
          Create test content for debugging purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={createDemoContent}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Content..." : "Create Demo Content"}
          </Button>
          <p className="text-xs text-gray-500">
            This will create a blog post and a complete set of horoscopes for today ({today})
          </p>
        </div>

        {debugOutput && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Debug Output:</h3>
            <Textarea
              value={debugOutput}
              readOnly
              className="h-60 font-mono text-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugPanel;