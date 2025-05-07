"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  VideoCameraIcon,
  ForwardIcon,
  BackwardIcon
} from "@heroicons/react/24/outline";

interface SessionRecordingProps {
  deviceId: string;
  deviceName: string;
  service: "teamviewer";
}

export function SessionRecording({
  deviceId,
  deviceName,
  service
}: SessionRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(180); // 3 minutes in seconds
  const [recordingsList, setRecordingsList] = useState([
    { id: "rec1", date: "2023-06-15", duration: 180, size: "12.4 MB" },
    { id: "rec2", date: "2023-06-10", duration: 320, size: "21.8 MB" },
    { id: "rec3", date: "2023-06-05", duration: 145, size: "9.7 MB" }
  ]);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [autoRecord, setAutoRecord] = useState(false);

  // Handle recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Handle playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= playbackDuration) {
            setIsPlaying(false);
            return playbackDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackDuration]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    // Simulate saving a new recording
    const newRecording = {
      id: `rec${recordingsList.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      duration: recordingTime,
      size: `${(recordingTime * 0.07).toFixed(1)} MB`
    };

    setRecordingsList([newRecording, ...recordingsList]);
    setRecordingTime(0);
  };

  const handlePlayRecording = (recordingId: string) => {
    setSelectedRecording(recordingId);
    setPlaybackTime(0);

    // Find the selected recording to get its duration
    const recording = recordingsList.find(r => r.id === recordingId);
    if (recording) {
      setPlaybackDuration(recording.duration);
    }

    setIsPlaying(true);
  };

  const handlePausePlayback = () => {
    setIsPlaying(false);
  };

  const handleResumePlayback = () => {
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    setPlaybackTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <VideoCameraIcon className="h-5 w-5 mr-2" />
          Session Recording
        </CardTitle>
        <CardDescription>
          Record and review remote sessions for {deviceName} via TeamViewer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-record">Auto-Record Sessions</Label>
            <p className="text-sm text-slate-500">
              Automatically record all remote sessions
            </p>
          </div>
          <Switch
            id="auto-record"
            checked={autoRecord}
            onCheckedChange={setAutoRecord}
          />
        </div>

        {isRecording ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <span className="font-medium text-red-800 dark:text-red-400">Recording in progress</span>
              </div>
              <span className="font-mono text-red-800 dark:text-red-400">{formatTime(recordingTime)}</span>
            </div>
            <div className="mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStopRecording}
                className="w-full"
              >
                <StopIcon className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleStartRecording}
            className="w-full"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {selectedRecording && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Playback</h3>
              <span className="text-sm text-slate-500">
                {formatTime(playbackTime)} / {formatTime(playbackDuration)}
              </span>
            </div>

            <div className="space-y-2">
              <Slider
                value={[playbackTime]}
                max={playbackDuration}
                step={1}
                onValueChange={handleSeek}
              />

              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}>
                  <BackwardIcon className="h-4 w-4" />
                </Button>

                {isPlaying ? (
                  <Button variant="outline" size="sm" onClick={handlePausePlayback}>
                    <PauseIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleResumePlayback}>
                    <PlayIcon className="h-4 w-4" />
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => setPlaybackTime(Math.min(playbackDuration, playbackTime + 10))}>
                  <ForwardIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-md h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">
                Session playback preview would appear here
              </p>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Recorded Sessions</h3>
          <div className="space-y-2">
            {recordingsList.map((recording) => (
              <div
                key={recording.id}
                className={`p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedRecording === recording.id ? 'border-blue-500 dark:border-blue-400' : ''}`}
                onClick={() => handlePlayRecording(recording.id)}
              >
                <div>
                  <div className="font-medium">{recording.date}</div>
                  <div className="text-xs text-slate-500">
                    Duration: {formatTime(recording.duration)} | Size: {recording.size}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <PlayIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
