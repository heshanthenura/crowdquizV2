import NavBar from "@/app/components/NavBar";
import { Github, Instagram, Linkedin, Youtube } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className=" max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                CQ
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                About CrowdQuiz
              </h1>
              <p className="text-gray-600">Modern Quiz Platform</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  CrowdQuiz is dedicated to making learning interactive and
                  engaging through well-designed quizzes. We believe that
                  testing knowledge should be both effective and enjoyable,
                  which is why we've created a platform with a clean, modern
                  interface that focuses on the learning experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Features
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>
                      Clean and minimal user interface for distraction-free quiz
                      taking
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>
                      Real-time timer with visual feedback and auto-submission
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>
                      Comprehensive results with correct answer highlighting
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>
                      Easy quiz creation with JSON bulk import functionality
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>
                      Responsive design that works seamlessly on all devices
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Developer
                </h2>
                <p className="text-gray-700 font-medium mb-4">
                  Heshan Thenura Kariyawasam
                </p>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-blue-600" />
                    <a
                      href="https://github.com/heshanthenura"
                      className="hover:text-blue-600 transition-colors"
                    >
                      github.com/heshanthenura
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <a
                      href="https://www.linkedin.com/in/heshanthenura/"
                      className="hover:text-blue-600 transition-colors"
                    >
                      linkedin.com/in/heshanthenura
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-blue-600" />
                    <a
                      href="https://www.instagram.com/heshan_thenura/"
                      className="hover:text-blue-600 transition-colors"
                    >
                      instagram.com/heshan_thenura
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-blue-600" />
                    <a
                      href="https://www.youtube.com/@heshanthenura"
                      className="hover:text-blue-600 transition-colors"
                    >
                      youtube.com/@heshanthenura
                    </a>
                  </div>
                </div>
              </section>

              <section className="pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm text-center">
                  Made with love by Heshan Thenura Kariyawasam
                  <br />© 2026 Heshan Thenura Kariyawasam. All rights reserved.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
