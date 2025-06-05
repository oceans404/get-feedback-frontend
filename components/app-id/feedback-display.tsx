"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Globe,
  Monitor,
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BarChart3,
  Code,
  ArrowRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface FeedbackItem {
  _id: string
  rating?: string
  message: string
  url?: string
  timestamp: string
  browser?: string
  platform?: string
  language?: string
  email?: string
  screenshot?: string
  userAgent?: string
  screenSize?: string
  referrer?: string
}

interface FeedbackDisplayProps {
  schemaId: string
  onSwitchToCodeTab?: () => void
}

export function FeedbackDisplay({ schemaId, onSwitchToCodeTab }: FeedbackDisplayProps) {
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([])
  const [displayedFeedback, setDisplayedFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [positivityScore, setPositivityScore] = useState<number | null>(null)
  const [totalRatedFeedback, setTotalRatedFeedback] = useState(0)
  const [positiveCount, setPositiveCount] = useState(0)
  const [negativeCount, setNegativeCount] = useState(0)
  const itemsPerPage = 10
  const { toast } = useToast()

  const fetchFeedback = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/get-app-feedback?schemaId=${encodeURIComponent(schemaId)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch feedback")
      }

      const data = await response.json()
      const feedbackData = data.records || []

      // Sort by timestamp (newest first)
      feedbackData.sort((a: FeedbackItem, b: FeedbackItem) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      setAllFeedback(feedbackData)
      calculatePositivityScore(feedbackData)
      applyFilters(feedbackData, searchQuery, ratingFilter)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Error fetching feedback",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePositivityScore = (data: FeedbackItem[]) => {
    // Count feedback items with ratings
    const ratedFeedback = data.filter((item) => item.rating)
    const totalRated = ratedFeedback.length

    // Count positive ratings
    const positive = ratedFeedback.filter((item) => item.rating === "positive").length

    // Count negative ratings
    const negative = ratedFeedback.filter((item) => item.rating === "negative").length

    setTotalRatedFeedback(totalRated)
    setPositiveCount(positive)
    setNegativeCount(negative)

    // Calculate positivity score (percentage of positive ratings)
    if (totalRated > 0) {
      const score = (positive / totalRated) * 100
      setPositivityScore(score)
    } else {
      setPositivityScore(null)
    }
  }

  const applyFilters = (data: FeedbackItem[], query: string, rating: string) => {
    let result = [...data]

    // Apply rating filter
    if (rating !== "all") {
      result = result.filter((item) => item.rating === rating)
    }

    // Apply search query
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        (item) =>
          item.message.toLowerCase().includes(lowerQuery) ||
          (item.email && item.email.toLowerCase().includes(lowerQuery)) ||
          (item.url && item.url.toLowerCase().includes(lowerQuery)),
      )
    }

    setFilteredFeedback(result)
    setTotalPages(Math.max(1, Math.ceil(result.length / itemsPerPage)))

    // Reset to first page when filters change
    setCurrentPage(1)
    updateDisplayedFeedback(result, 1)
  }

  const updateDisplayedFeedback = (data: FeedbackItem[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedFeedback(data.slice(startIndex, endIndex))
  }

  useEffect(() => {
    fetchFeedback()
  }, [schemaId])

  useEffect(() => {
    applyFilters(allFeedback, searchQuery, ratingFilter)
  }, [searchQuery, ratingFilter])

  useEffect(() => {
    updateDisplayedFeedback(filteredFeedback, currentPage)
  }, [filteredFeedback, currentPage])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setRatingFilter("all")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch (e) {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Feedback</h2>
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-32 w-full mb-4" />
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // No feedback yet - show prompt to add widget
  if (allFeedback.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Feedback</h2>
          <Button variant="outline" size="sm" onClick={fetchFeedback} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center py-16">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-primary/60" />
            <h3 className="text-2xl font-medium mb-3">No feedback yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't received any feedback yet. Add the feedback widget to your website or app to start collecting
              valuable user insights.
            </p>
            {onSwitchToCodeTab && (
              <Button onClick={onSwitchToCodeTab} size="lg" className="gap-2">
                <Code className="h-4 w-4" />
                Add Widget to Your App
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <Button variant="outline" size="sm" onClick={fetchFeedback} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Positivity Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Feedback Overview
          </CardTitle>
          <CardDescription>Summary of feedback ratings from {allFeedback.length} total submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Positivity Score</h3>
              {positivityScore !== null ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {positiveCount} positive / {totalRatedFeedback} total
                    </span>
                    <span className="font-medium">{Math.round(positivityScore)}%</span>
                  </div>
                  <Progress
                    value={positivityScore}
                    className="h-2"
                    indicatorClassName={
                      positivityScore >= 70 ? "bg-green-500" : positivityScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No rated feedback yet</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Rating Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>Positive</span>
                      <span>{positiveCount}</span>
                    </div>
                    <Progress
                      value={totalRatedFeedback > 0 ? (positiveCount / totalRatedFeedback) * 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>Negative</span>
                      <span>{negativeCount}</span>
                    </div>
                    <Progress
                      value={totalRatedFeedback > 0 ? (negativeCount / totalRatedFeedback) * 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-red-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>Unrated</span>
                      <span>{allFeedback.length - totalRatedFeedback}</span>
                    </div>
                    <Progress
                      value={
                        allFeedback.length > 0
                          ? ((allFeedback.length - totalRatedFeedback) / allFeedback.length) * 100
                          : 0
                      }
                      className="h-2 bg-muted"
                      indicatorClassName="bg-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in feedback messages..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Select value={ratingFilter} onValueChange={handleRatingFilterChange}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by rating" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="positive">Positive Only</SelectItem>
              <SelectItem value="negative">Negative Only</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || ratingFilter !== "all") && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || ratingFilter !== "all") && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {ratingFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Rating: {ratingFilter === "positive" ? "Positive" : "Negative"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setRatingFilter("all")} />
            </Badge>
          )}
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground mb-2">
        {filteredFeedback.length === 0 ? (
          "No feedback found"
        ) : (
          <>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFeedback.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length} feedback items
            {allFeedback.length !== filteredFeedback.length && ` (filtered from ${allFeedback.length} total)`}
          </>
        )}
      </div>

      {filteredFeedback.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No matching feedback</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {displayedFeedback.map((item) => (
            <Card key={item._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {item.rating && (
                      <div className="mr-2">
                        {item.rating === "positive" ? (
                          <ThumbsUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <ThumbsDown className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                    <CardTitle className="text-base">Feedback from {item.url || "Unknown URL"}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                {item.email && <CardDescription>From: {item.email}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="mb-4 whitespace-pre-wrap">{item.message}</div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.browser && (
                    <span className="bg-muted px-2 py-1 rounded-full flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {item.browser}
                    </span>
                  )}
                  {item.platform && (
                    <span className="bg-muted px-2 py-1 rounded-full flex items-center">
                      <Monitor className="h-3 w-3 mr-1" />
                      {item.platform}
                    </span>
                  )}
                  {item.screenSize && (
                    <span className="bg-muted px-2 py-1 rounded-full">Screen: {item.screenSize}</span>
                  )}
                  {item.language && <span className="bg-muted px-2 py-1 rounded-full">Lang: {item.language}</span>}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
