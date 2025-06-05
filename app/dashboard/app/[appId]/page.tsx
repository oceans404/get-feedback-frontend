"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Mail, User, MessageSquare } from "lucide-react"
import { ShareAppButton } from "@/components/app-id/share-app-button"
import { AppConfigForm } from "@/components/app-id/app-config-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/app-id/copy-button"
import { DeleteAppButton } from "@/components/app-id/delete-app-button"
import { FeedbackDisplay } from "@/components/app-id/feedback-display"
import { useState, useEffect } from "react"

interface AppDetailPageProps {
  params: {
    appId: string
  }
}

export default function AppDetailPage({ params }: AppDetailPageProps) {
  const { appId } = params
  const [app, setApp] = useState<any>(null)
  const [owner, setOwner] = useState<any>(null)
  const [accessUsers, setAccessUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("feedback")
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      setUser(session.user)

      // Fetch app details
      const { data: appData, error: appError } = await supabase.from("app_ids").select("*").eq("app_id", appId).single()

      if (appError || !appData) {
        notFound()
        return
      }

      // Check if user has access to this app
      const hasAccess =
        appData.owner_id === session.user.id || (appData.access_users && appData.access_users.includes(session.user.id))

      if (!hasAccess) {
        window.location.href = "/dashboard"
        return
      }

      // Fetch owner details
      const { data: ownerData } = await supabase.from("profiles").select("email").eq("id", appData.owner_id).single()

      // Fetch users who have access to this app
      const { data: accessUsersData } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", appData.access_users || [])

      setApp(appData)
      setOwner(ownerData)
      setAccessUsers(accessUsersData || [])
      setIsLoading(false)
    }

    fetchData()
  }, [appId])

  const handleSwitchToCodeTab = () => {
    setActiveTab("code")
  }

  if (isLoading || !app) {
    return <div>Loading...</div>
  }

  const isOwner = app.owner_id === user.id
  const appName = app.app_name || "Unnamed Widget"

  const embedCode = `<!-- Load the feedback widget -->
<script
  src="https://422c26e9.feedback-widget-u8y.pages.dev/widget.js"
  data-server-url="https://feedback-widget-orrr.onrender.com"
></script>
<script>
  // Initialize the widget
  window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
    console.log('Widget initialized with config:', config);
  });
</script>`

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 py-6">
        <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-primary" />
              {appName}
            </h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="code">Add Code Snippet</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="feedback">
              <FeedbackDisplay schemaId={app.schema_id_migrated || app.schema_id} onSwitchToCodeTab={handleSwitchToCodeTab} />
            </TabsContent>

            <TabsContent value="configuration">
              <AppConfigForm
                appId={app.id}
                appName={appName}
                initialDomain={app.domain || ""}
                initialConfig={
                  app.config || {
                    title: "Feedback",
                    successMessage: "Thanks for providing feedback to improve our product!",
                    buttonText: "Send Feedback",
                    buttonStyle: "dark",
                    showRating: true,
                    ratingQuestion: "Do you like this product?",
                    requireEmail: false,
                    emailPlaceholder: "your@email.com",
                    messagePlaceholder: "Tell us how we can improve",
                    highlightColor: "#0070f3",
                  }
                }
                isOwner={isOwner}
              />
            </TabsContent>

            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>Installation Code</CardTitle>
                  <CardDescription>Add this code to your website to embed the feedback widget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="html" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                    </TabsList>

                    <TabsContent value="html">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Add to your HTML page</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add the following code at the end of your{" "}
                          <code className="font-mono bg-muted px-1 py-0.5 rounded">&lt;head&gt;</code> section, below
                          all other style and metadata tags:
                        </p>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">{embedCode}</pre>
                          <CopyButton text={embedCode} className="absolute top-2 right-2" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="nextjs">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Add to your Next.js project</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Copy this entire code block and choose the implementation that works best for your project:
                        </p>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">{`// For Next.js with app/ directory structure

// OPTION 1: Create a client component for the feedback widget
// app/components/FeedbackWidget.js or app/components/FeedbackWidget.jsx

'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function FeedbackWidget() {
  useEffect(() => {
    // This runs after component mount, when first script might be loaded
    const hasScript = typeof window !== 'undefined' && window.embed_feedback_widget;
    
    if (hasScript) {
      // Script already loaded, initialize directly
      window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
        console.log('Widget initialized with config:', config);
      });
    }
    // If not loaded yet, the onLoad handler below will handle it
  }, []);

  const handleScriptLoad = () => {
    // This runs when the script is fully loaded
    if (window.embed_feedback_widget) {
      window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
        console.log('Widget initialized with config:', config);
      });
    }
  };

  return (
    <Script
      src="https://422c26e9.feedback-widget-u8y.pages.dev/widget.js"
      data-server-url="https://feedback-widget-orrr.onrender.com"
      onLoad={handleScriptLoad}
    />
  );
}

// OPTION 2: Alternative approach using a custom Script component in layout.js
// app/layout.js

// For OPTION 2, create this file:
// app/components/ClientScript.js or app/components/ClientScript.jsx

'use client';

import { useEffect } from 'react';

export default function ClientScript() {
  useEffect(() => {
    // Create and load the first script
    const script = document.createElement('script');
    script.src = 'https://422c26e9.feedback-widget-u8y.pages.dev/widget.js';
    script.setAttribute('data-server-url', 'https://feedback-widget-orrr.onrender.com');
    
    // Set up onload handler for first script
    script.onload = () => {
      // Check if the widget function exists
      if (window.embed_feedback_widget) {
        // Initialize the widget
        window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
          console.log('Widget initialized with config:', config);
        });
      }
    };
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return null;
}

// Then add this component to your app/layout.js:
// import ClientScript from './components/ClientScript';
//
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//         <ClientScript />
//       </body>
//     </html>
//   );
// }`}</pre>
                          <CopyButton
                            text={`// For Next.js with app/ directory structure

// OPTION 1: Create a client component for the feedback widget
// app/components/FeedbackWidget.js or app/components/FeedbackWidget.jsx

'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function FeedbackWidget() {
  useEffect(() => {
    // This runs after component mount, when first script might be loaded
    const hasScript = typeof window !== 'undefined' && window.embed_feedback_widget;
    
    if (hasScript) {
      // Script already loaded, initialize directly
      window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
        console.log('Widget initialized with config:', config);
      });
    }
    // If not loaded yet, the onLoad handler below will handle it
  }, []);

  const handleScriptLoad = () => {
    // This runs when the script is fully loaded
    if (window.embed_feedback_widget) {
      window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
        console.log('Widget initialized with config:', config);
      });
    }
  };

  return (
    <Script
      src="https://422c26e9.feedback-widget-u8y.pages.dev/widget.js"
      data-server-url="https://feedback-widget-orrr.onrender.com"
      onLoad={handleScriptLoad}
    />
  );
}

// OPTION 2: Alternative approach using a custom Script component in layout.js
// app/layout.js

// For OPTION 2, create this file:
// app/components/ClientScript.js or app/components/ClientScript.jsx

'use client';

import { useEffect } from 'react';

export default function ClientScript() {
  useEffect(() => {
    // Create and load the first script
    const script = document.createElement('script');
    script.src = 'https://422c26e9.feedback-widget-u8y.pages.dev/widget.js';
    script.setAttribute('data-server-url', 'https://feedback-widget-orrr.onrender.com');
    
    // Set up onload handler for first script
    script.onload = () => {
      // Check if the widget function exists
      if (window.embed_feedback_widget) {
        // Initialize the widget
        window.embed_feedback_widget('init', '${app.app_id}').then((config) => {
          console.log('Widget initialized with config:', config);
        });
      }
    };
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return null;
}

// Then add this component to your app/layout.js:
// import ClientScript from './components/ClientScript';
//
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//         <ClientScript />
//       </body>
//     </html>
//   );
// }`}
                            className="absolute top-2 right-2"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Step 2: Test the widget</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      After adding the code to your website or application, refresh the page and you should see the
                      feedback button appear in the bottom right corner of your website.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Widget Details</CardTitle>
                    <CardDescription>Information about this feedback widget</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Widget ID</h3>
                      <p className="font-mono bg-muted px-2 py-1 rounded inline-block">{app.app_id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Domain</h3>
                      <p className="font-mono bg-muted px-2 py-1 rounded inline-block">{app.domain}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Nillion SecretVault Schema ID</h3>
                      <p className="font-mono bg-muted px-2 py-1 rounded inline-block">{app.schema_id_migrated || app.schema_id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner</h3>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{owner?.email || "Unknown"}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access</CardTitle>
                    <CardDescription>Users with access to this widget</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Registered Users</h3>
                      {accessUsers && accessUsers.length > 0 ? (
                        <ul className="space-y-2">
                          {accessUsers.map((user) => (
                            <li key={user.id} className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">{user.email}</span>
                              {user.id === app.owner_id && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Owner
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No registered users have access to this widget.</p>
                      )}
                    </div>

                    {app.invited_emails && app.invited_emails.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Pending Invitations</h3>
                        <ul className="space-y-2">
                          {app.invited_emails.map((email) => (
                            <li key={email} className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">{email}</span>
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Pending
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isOwner && (
                      <div className="pt-2">
                        <ShareAppButton app={app} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {isOwner && (
                <Card className="mt-6 border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Actions that cannot be undone</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Delete this widget</h3>
                        <p className="text-sm text-muted-foreground">
                          Once deleted, all data associated with this widget will be permanently removed.
                        </p>
                      </div>
                      <DeleteAppButton appId={app.id} appName={appName} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
