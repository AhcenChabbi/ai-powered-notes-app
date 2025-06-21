import { Brain, Languages, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Smart Note-Taking
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform the way you capture and organize information with
            AI-powered tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                AI Summarization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Automatically generate concise summaries of your lengthy notes
                and documents with advanced AI technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Auto Tagging & Title Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Smart categorization and title suggestions help you organize and
                find your notes effortlessly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Languages className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Translate & Rewrite Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground leading-relaxed">
                Break language barriers and improve clarity with instant
                translation and intelligent rewriting features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
